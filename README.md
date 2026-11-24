# Perfume shop — deployment folder

This folder is the site root. The static storefront reads `products.json` and `shop.json`. The admin at `/admin/` uses Decap CMS, and uploaded product photos are stored in `images/products/`.

## Deploy

1. Create an empty GitHub repository and push the contents of this folder to its `main` branch. This folder itself is the deploy root.
2. Import that repository into Netlify and deploy the repository root. Netlify serves the storefront at its free `netlify.app` address; a custom domain is optional.
3. Create a Decap Turbo account, connect GitHub, install the Decap Turbo GitHub App for this repository, and create a site for the repository and `main` branch. Set the CMS config path to `admin/config.yml` and the admin URL to the deployed site's `/admin/` URL.
4. Copy the Site ID shown by Decap Turbo into `turbo_site_id` in `admin/config.yml`, commit and push that change.
5. Open `/admin/`, sign in, set the shop WhatsApp number, then manage products and photos. CMS saves become Git commits; Netlify publishes the updated site.

Decap Turbo's Free plan includes one site and one editor seat. Netlify's Free hosting plan has a monthly usage allowance. The live admin uses Decap Turbo's authenticated GitHub backend; replace the placeholder Site ID before the CMS can connect.

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
