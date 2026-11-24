const fallbackProducts = [];
let products = fallbackProducts;
let currentFamily = 'All';
let currentAudience = 'All';
let searchTerm = '';
const grid = document.getElementById('productGrid');
const families = ['All','Amber','Floral','Fresh','Oud','Woody'];
const audiences = ['All','Women','Men','Unisex'];
const money = value => '₹' + Number(value || 0).toLocaleString('en-IN');
const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const productUrl = product => `product.html?id=${encodeURIComponent(product.id)}`;
const notesText = product => ['top','heart','base'].flatMap(key => product.notes?.[key] || []).join(' · ');

function productCard(product) {
  const badge = product.tag ? `<span class="product-badge">${safe(product.tag)}</span>` : '';
  const sold = product.stock === 'Sold out' ? '<span class="sold-badge">SOLD OUT</span>' : '';
  return `<article class="product-card"><a class="product-link" href="${productUrl(product)}"><div class="product-image"><img src="${safe(product.image)}" alt="${safe(product.name)} perfume" loading="lazy">${badge}${sold}</div><div class="product-info"><div class="product-meta">${safe(product.family)} · ${safe(product.audience)}</div><h3 class="product-name">${safe(product.name)}</h3><p class="product-notes">${safe(notesText(product))}</p><div class="product-bottom"><span class="product-price">${money(product.price)}</span><span class="product-size">${safe(product.size)}</span></div></div></a></article>`;
}
function renderFilters() {
  document.getElementById('familyFilters').innerHTML = families.map(value => `<button class="filter-pill${currentFamily === value ? ' active' : ''}" type="button" data-family="${value}" aria-pressed="${currentFamily === value}">${value}</button>`).join('');
  document.getElementById('audienceFilters').innerHTML = audiences.map(value => `<button class="audience-pill${currentAudience === value ? ' active' : ''}" type="button" data-audience="${value}" aria-pressed="${currentAudience === value}">${value}</button>`).join('');
  document.querySelectorAll('[data-family]').forEach(button => button.addEventListener('click', () => { currentFamily = button.dataset.family; renderFilters(); renderProducts(); }));
  document.querySelectorAll('[data-audience]').forEach(button => button.addEventListener('click', () => { currentAudience = button.dataset.audience; renderFilters(); renderProducts(); }));
}
function renderProducts() {
  const term = searchTerm.toLowerCase();
  let filtered = products.filter(product => (currentFamily === 'All' || product.family === currentFamily) && (currentAudience === 'All' || product.audience === currentAudience) && (!term || `${product.name} ${product.family} ${product.audience} ${product.subtitle} ${product.description} ${notesText(product)}`.toLowerCase().includes(term)));
  const sort = document.getElementById('sort').value;
  if (sort === 'low') filtered.sort((a,b) => a.price - b.price);
  if (sort === 'high') filtered.sort((a,b) => b.price - a.price);
  if (sort === 'newest') filtered.reverse();
  if (sort === 'featured') filtered.sort((a,b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  grid.innerHTML = filtered.length ? filtered.map(productCard).join('') : `<p class="empty-state">${products.length ? 'No fragrances found. Try another name or scent family.' : 'Your products will appear here after you add them in Admin.'}</p>`;
}
function renderHero() {
  const featured = products.find(product => product.featured) || products[0];
  if (!featured) {
    document.getElementById('houseCount').textContent = 'Your products will appear here';
    const link = document.getElementById('featuredLink');
    link.hidden = true;
    document.getElementById('notesMarquee').innerHTML = '<span class="marquee-note">Your fragrance notes will appear here</span><span aria-hidden="true">✦</span>'.repeat(2);
    return;
  }
  document.getElementById('houseCount').textContent = `${products.length} scents in the house`;
  document.getElementById('featuredLink').href = productUrl(featured);
  document.getElementById('featuredLink').innerHTML = `<img src="${safe(featured.image)}" alt=""><span class="featured-copy"><small>THIS WEEK'S FAVOURITE</small><strong>${safe(featured.name)}</strong><span>${money(featured.price)} · ${safe(featured.size)}</span></span><span class="featured-arrow">→</span>`;
  const noteList = [...new Set(products.flatMap(product => ['top','heart','base'].flatMap(key => product.notes?.[key] || [])))];
  const repeated = [...noteList, ...noteList];
  document.getElementById('notesMarquee').innerHTML = repeated.map(note => `<span class="marquee-note">${safe(note)}</span><span aria-hidden="true">✦</span>`).join('');
}
document.getElementById('search').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderProducts(); });
document.getElementById('sort').addEventListener('change', renderProducts);
document.getElementById('year').textContent = new Date().getFullYear();
renderFilters();
Promise.all([fetch('products.json').then(response => { if (!response.ok) throw new Error('Catalog unavailable'); return response.json(); }),fetch('shop.json').then(response => response.json()).catch(() => ({}))]).then(([data,shop]) => {
  products = Array.isArray(data) ? data : (data.products || []);
  if (shop.brand) document.querySelectorAll('[data-brand]').forEach(node => node.textContent = shop.brand);
  if (shop.tagline) document.querySelectorAll('[data-tagline]').forEach(node => node.textContent = shop.tagline);
  renderHero(); renderProducts();
}).catch(() => { grid.innerHTML = '<p class="empty-state">The fragrance collection could not be loaded. Please refresh in a moment.</p>'; });
