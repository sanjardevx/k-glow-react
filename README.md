# K-Glow Secrets — Shop (Frontend)

The customer-facing shop for **[K-Glow Secrets](https://www.kglowshop.uz)** — original Korean skincare and makeup from Seoul, delivered across Uzbekistan. Built with React and TypeScript, deployed on Vercel.

| | |
|---|---|
| **Live shop** | https://www.kglowshop.uz |
| **API** (backend repo) | https://api.kglowshop.uz · [`sanjardev23/kglow-backend`](https://github.com/sanjardev23/kglow-backend) |
| **Admin panel** | https://admin.kglowshop.uz (served by the backend) |

---

## What's in the shop

- **Catalog** — browse, search, filter by category, sort; product pages with photo gallery, reviews and view counts.
- **Bag and checkout** — a shopping bag, then an order with a bank-transfer receipt upload. Customers also order on Telegram.
- **Accounts** — sign up with name and password, or **Sign in with Google**. My Page shows profile, order history and the saved skin routine.
- **AI Beauty** — a 4-tap skin quiz that builds a morning and evening routine from products in stock, shown as an illustrated step-by-step guide; or a short chat for direct questions. Members only, 5 answers a day.
- **Tutorials** — short video tutorials (YouTube / Instagram).
- **Three languages** — Uzbek (Latin), Russian, English, switchable anywhere.
- **Phone-first design** — bottom tab bar, glass header, buy bars, built for one-handed use.
- **Link previews and SEO** — product links shared on Telegram/Instagram show the photo, name and price; a live sitemap for Google.

## Tech stack

| Area | Choice |
|---|---|
| UI | React 19, TypeScript, MUI 9 (layout and a few widgets) |
| Routing | React Router 5 |
| State | Redux Toolkit (catalog, orders, bag) + React context (signed-in member) |
| HTTP | Axios (adds the login token to every request) |
| Styling | Plain CSS with design tokens (`--kg-*`), one stylesheet per page |
| Build | Vite 8 |
| Lint | Oxlint |
| Hosting | Vercel (static site + 2 serverless functions), Vercel Web Analytics |

---

## Getting started

### 1. Prerequisites

- **Node.js 22 or newer** and **Yarn** (`npm i -g yarn`)
- The backend running locally, or use the live API

### 2. Install

```bash
git clone https://github.com/sanjardev23/k-glow-react.git
cd k-glow-react
yarn install
```

### 3. Configure

Create a `.env` file in the project root:

```env
VITE_SERVER_API=http://localhost:3004
VITE_GOOGLE_CLIENT_ID=<Google OAuth Client ID>   # optional
```

| Variable | Required | What it is |
|---|---|---|
| `VITE_SERVER_API` | ✅ | The backend's address, no trailing `/`. Production: `https://api.kglowshop.uz` |
| `VITE_GOOGLE_CLIENT_ID` | | Shows the "Continue with Google" button. Leave it out and the button simply doesn't appear |

> Everything starting with `VITE_` is built into the public JavaScript, so it must never hold a secret. Both values above are public by design.

### 4. Run

```bash
yarn dev
```

Opens on `http://localhost:8002`. The backend always allows that address, so no CORS setup is needed for local work.

## Scripts

| Command | What it does |
|---|---|
| `yarn dev` | Development server with instant reload |
| `yarn build` | Type-check, then build for production into `dist/` |
| `yarn preview` | Serve the production build locally to check it |
| `yarn lint` | Run Oxlint |

---

## Project structure

```
src/
  main.tsx              entry: providers (Redux, theme, member context, router), Axios token
  app/
    App.tsx             layout and routes
    screens/            one folder per page
      homePage/         hero, bestsellers, new arrivals, brands, reviews, events
      productsPage/     catalog and product detail
      cartPage/         bag (Redux slice) and checkout
      ordersPage/       waiting / confirmed / rejected orders
      userPage/         My Page
      aiBeautyPage/     quiz, chat, routine guide and its SVG illustrations
      tutorialsPage/    video tutorials
      helpPage/         terms, FAQ, contact
      privacyPage/      privacy policy (uz / ru / en)
    components/         header, footer, bottom tab bar, auth modal, payment modal, icons
    services/           one class per API area (ProductService, OrderService, AiService, …)
    context/            the signed-in member
  lib/
    i18n/               dictionaries (uz, ru, en) and the t() helper
    types/              TypeScript types shared across pages
    config.ts           API address, Telegram links, Google Client ID
  css/                  tokens.css, base.css, components.css, then one file per page
api/                    Vercel serverless functions (see below)
public/                 icons, logo, link-preview image, robots.txt
docs/DESIGN_SYSTEM.md   colours, type, spacing and component rules
vercel.json             rewrites: sitemap, link-preview bots, single-page fallback
```

**How a page gets its data:** the screen calls a **service** (`src/app/services`), which calls the API with Axios; results go into the page's Redux slice (or local state) and the components render from there. The login token is attached to every request in `main.tsx`, so services never deal with it.

## Languages

All text lives in `src/lib/i18n/` — `en.ts` is the source, `uz.ts` and `ru.ts` must have the same keys (TypeScript enforces it). In a component:

```tsx
const { t } = useI18n();
<h1>{t("ai.title")}</h1>
```

Uzbek is written in Latin script with the proper letters `oʻ`, `gʻ` (U+02BB) and `ʼ` (U+02BC). Error messages from the API are translated by matching them in `SERVER_MESSAGES` (`src/lib/i18n/index.ts`).

## Design system

Warm cream and sand surfaces, plum ink, sage green as the one brand colour, terracotta as an accent; Playfair Display for headings, Inter for text.

- **`src/css/tokens.css`** holds every colour, radius, shadow and type size as `--kg-*` variables. It is the **only** file allowed a colour literal (exception: `src/app/MaterialTheme`, because MUI needs real hex values).
- **`base.css`** and **`components.css`** load next (shared buttons, inputs, cards, chips); page stylesheets load after them and win ties.
- Respect `prefers-reduced-motion`, keep touch targets at least 44px, and check phone width (375px) for every change.

The full reference is in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Serverless functions (`api/`)

The shop is a single-page app, so its HTML is nearly empty until JavaScript runs. Two small Vercel functions cover the readers that don't run it:

| Function | Path | Purpose |
|---|---|---|
| `api/preview.ts` | any page, **only for link-preview bots** (Telegram, WhatsApp, Facebook, …) | Returns the product's photo, name and price as Open Graph tags, so shared links show a card |
| `api/sitemap.ts` | `/sitemap.xml` | Lists the public pages and every product, read live from the API |

`index.html` also contains a short plain-HTML description of the shop inside `#root` (React replaces it on load). Google's sign-in review and search engines read it — keep the name exactly **"K-Glow Secrets"** and the privacy / terms links.

## Deployment

Vercel deploys automatically:

- **Push to `develop`** → production at `www.kglowshop.uz` (`kglowshop.uz` redirects there).
- Environment variables are set in **Vercel → Settings → Environment Variables**. `VITE_*` values are baked in at build time, so **redeploy after changing one**.
- DNS is managed at ahost: `@` (A) and `www` (CNAME) point to Vercel; `api` and `admin` point to the backend server.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Products don't load, CORS error in the console | `VITE_SERVER_API` is wrong, or the backend's `CORS_ORIGINS` doesn't include this address |
| No "Continue with Google" button | `VITE_GOOGLE_CLIENT_ID` missing, or the site wasn't redeployed after adding it |
| Google says "origin not allowed" | Add the address to the OAuth client's *Authorized JavaScript origins* in Google Cloud |
| Product photos show the placeholder bottle | The image path doesn't exist on the API (check the product in the admin panel) |
| A change to a `VITE_` variable has no effect | Redeploy — Vite reads these at build time |

## Contributing

Work on `develop`. Commit messages are one line, `feat:` for something new and `fix:` for changing something that exists, e.g. `feat: integrate vercel web analytics`. Run `yarn build && yarn lint` before pushing, and check the change on a phone-sized screen.
