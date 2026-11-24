# Perfume shop — deployment folder

This folder is the site root. The static storefront reads `products.json` and `shop.json`. The admin at `/admin/` uses Decap CMS, and uploaded product photos are stored in `images/products/`.

## Deploy to GitHub Pages

1. Push this folder's contents to the root of the `main` branch in the `girish-cn/perfume-shop` repository.
2. In GitHub, open **Settings → Pages** and publish from the `main` branch and `/ (root)`.
3. In Decap Turbo, connect GitHub, install the Decap Turbo GitHub App for this repository, and create a site for `girish-cn/perfume-shop` on `main`. Set the CMS config path to `admin/config.yml` and add this exact admin interface URL: `https://girish-cn.github.io/perfume-shop/admin/`.
4. Copy the Site ID shown by Decap Turbo into `turbo_site_id` in `admin/config.yml`, then commit and push the change.
5. Open `https://girish-cn.github.io/perfume-shop/admin/` and sign in. Set the shop WhatsApp number, then manage products and photos. CMS saves become Git commits; GitHub Pages republishes the site.

The Site ID must be a real ID from Decap Turbo. The placeholder `YOUR_DECAP_TURBO_SITE_ID` will prevent the hosted admin from connecting. Keep the deployed admin behind the authenticated Turbo backend; the no-login editor is only for local development.

## Local preview and editing

The local admin runs without a login and writes directly to this folder. It is selected only on `localhost`; the deployed admin continues to use the authenticated Decap Turbo backend.

From this folder, start the static site:

```sh
python3 -m http.server 8000
```

In a second terminal, from this same folder, start the local CMS file proxy:

```sh
npx decap-server@latest
```

Open `http://localhost:8000/admin/`. Use **Products** to add, edit, or delete fragrances; uploaded photos go into `images/products/`. The local proxy must stay running while editing. It is for local use only and does not require login. Local changes do not deploy until you commit and push the files.

## Add the real shop details

Six clearly marked sample fragrances are included to preview the collection and detail pages. Their photos use the placeholder artwork, and each description is labeled as demo copy. Before launch, replace these entries in `/admin/` with real products and upload their photos. In **Shop details**, update the business name, tagline, and WhatsApp number. Product data is stored in `products.json`; uploaded photos are saved in `images/products/` for Git.
