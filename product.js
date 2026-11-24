let productData = [];
let shopData = {whatsapp:'',brand:'Your Perfume House',tagline:'Your fragrance story goes here.'};
let quantity = 1;
const productRoot = document.getElementById('productRoot');
const amount = value => '₹' + Number(value || 0).toLocaleString('en-IN');
const safeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const currentId = new URLSearchParams(location.search).get('id');
const noteLabels = {top:['Top','First impression'],heart:['Heart','After a few minutes'],base:['Base','What lingers']};
function noteRow(key, values) {
  const [label, caption] = noteLabels[key];
  return `<div class="note-row"><div class="note-heading">${label}<small>${caption}</small></div><div class="note-tags">${(values || []).map(note => `<span class="note-tag">${safeText(note)}</span>`).join('')}</div></div>`;
}
function card(product) {
  const badge = product.tag ? `<span class="product-badge">${safeText(product.tag)}</span>` : '';
  const sold = product.stock === 'Sold out' ? '<span class="sold-badge">SOLD OUT</span>' : '';
  return `<article class="product-card"><a class="product-link" href="product.html?id=${encodeURIComponent(product.id)}"><div class="product-image"><img src="${safeText(product.image)}" alt="${safeText(product.name)} perfume" loading="lazy">${badge}${sold}</div><div class="product-info"><div class="product-meta">${safeText(product.family)} · ${safeText(product.audience)}</div><h3 class="product-name">${safeText(product.name)}</h3><p class="product-notes">${['top','heart','base'].flatMap(key => product.notes?.[key] || []).map(safeText).join(' · ')}</p><div class="product-bottom"><span class="product-price">${amount(product.price)}</span><span class="product-size">${safeText(product.size)}</span></div></div></a></article>`;
}
function render(product) {
  if (!product) { document.title = `Fragrance not found — ${shopData.brand}`; productRoot.innerHTML = '<p class="empty-state" style="padding:80px 5%">No product is listed here yet. <a href="index.html#collection">Browse the collection →</a></p>'; return; }
  document.title = `${product.name} — ${shopData.brand}`;
  const sold = product.stock === 'Sold out';
  productRoot.innerHTML = `<section class="product-detail"><a class="detail-back" href="index.html#collection">← &nbsp;All scents</a><div class="detail-layout"><div class="detail-image"><img src="${safeText(product.image)}" alt="${safeText(product.name)} perfume">${product.tag ? `<span class="product-badge">${safeText(product.tag)}</span>` : ''}</div><div class="detail-copy"><div class="detail-kicker">${safeText(product.family)} &nbsp;·&nbsp; ${safeText(product.audience)} &nbsp;·&nbsp; ${safeText(product.size)}</div><h1>${safeText(product.name)}</h1><p class="detail-subtitle">${safeText(product.subtitle)}</p><div class="detail-price-row"><span class="detail-price">${amount(product.price)}</span><span class="stock-label${sold ? ' sold' : ''}">${sold ? 'SOLD OUT' : 'IN STOCK'}</span></div><p class="detail-description">${safeText(product.description)}</p><div class="note-pyramid">${noteRow('top',product.notes?.top)}${noteRow('heart',product.notes?.heart)}${noteRow('base',product.notes?.base)}</div>${sold ? `<a class="whatsapp-button soldout-button" id="orderButton" href="#">ASK WHEN IT’S BACK</a><p class="order-note">This batch has sold out. Message us and we’ll let you know when it’s bottled again.</p>` : `<div class="buy-panel"><div class="buy-controls"><div class="quantity-control" aria-label="Quantity"><button type="button" id="decrease" aria-label="Decrease quantity">−</button><span id="quantity">1</span><button type="button" id="increase" aria-label="Increase quantity">+</button></div><div><span class="total-label">TOTAL</span><span class="total-price" id="total">${amount(product.price)}</span></div></div><a class="whatsapp-button" id="orderButton" href="#">ORDER NOW ON WHATSAPP <span>↗</span></a><p class="order-note">Opens WhatsApp with your order filled in — we’ll confirm delivery and payment there.</p></div>`}</div></div></section><section class="recommendations"><h2>Also in the house</h2><div class="product-grid">${productData.filter(item => item.id !== product.id).slice(0,3).map(card).join('')}</div></section>`;
  if (!sold) {
    document.getElementById('decrease').onclick = () => updateQuantity(product,-1);
    document.getElementById('increase').onclick = () => updateQuantity(product,1);
  }
  document.getElementById('orderButton').onclick = event => { event.preventDefault(); order(product,sold); };
}
function updateQuantity(product, delta) {
  quantity = Math.max(1,Math.min(99,quantity+delta));
  document.getElementById('quantity').textContent = quantity;
  document.getElementById('decrease').disabled = quantity === 1;
  document.getElementById('total').textContent = amount(product.price * quantity);
}
function order(product, sold) {
  const phone = String(shopData.whatsapp || '').replace(/\D/g,'');
  if (!phone) { alert('The shop has not added its WhatsApp number yet.'); return; }
  const message = sold
    ? `Hello ${shopData.brand}! Will ${product.name} (${product.size}) be back in stock soon?`
    : `Hello ${shopData.brand}! I'd like to order:\n\n*${product.name}* (${product.size})\nQuantity: ${quantity}\nPrice: ${amount(product.price)} each\nTotal: ${amount(product.price*quantity)}\n\n${location.href}`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
}
document.getElementById('year').textContent = new Date().getFullYear();
Promise.all([fetch('products.json').then(response => response.json()),fetch('shop.json').then(response => response.json()).catch(() => ({whatsapp:''}))]).then(([catalog,shop]) => {
  productData = Array.isArray(catalog) ? catalog : (catalog.products || []);
  shopData = {...shopData,...shop};
  if (shopData.brand) document.querySelectorAll('[data-brand]').forEach(node => node.textContent = shopData.brand);
  if (shopData.tagline) document.querySelectorAll('[data-tagline]').forEach(node => node.textContent = shopData.tagline);
  quantity = 1;
  render(productData.find(item => item.id === currentId));
}).catch(() => { productRoot.innerHTML = '<p class="empty-state" style="padding:80px 5%">The fragrance collection could not be loaded. Please refresh in a moment.</p>'; });
