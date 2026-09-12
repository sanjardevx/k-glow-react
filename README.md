# K-Glow React

This project is bootstrapped with [Vite](https://vite.dev), using React 19 + TypeScript and the [Redux Toolkit] pattern. Architecture is adapted from a course reference project (burak-react), restructured for K-Glow Secrets' own data model, API, and Figma design.

## Publishing Rules

- Layout Components

```
Container 1300px
Stack
Box
```

- Type of Components

```
- Screen Components: HomePage, ShopPage, CartPage, OrdersPage, UserPage, HelpPage
- Sectional Components: Bestsellers, Discounted, Reviews, Brands
- Common (Reusable) Components: Header & Footer
```

- CSS Layer Structure

The cream/sage design system (`src/css/`) loads in three layers, then per-page
stylesheets on top:

```
tokens.css       every colour/type/radius/shadow literal, as custom properties (--kg-*)
base.css         document defaults, focus ring, SweetAlert2 theming
components.css   shared primitives (buttons, inputs, cards, badges, modal shell) —
                 page classes are listed as aliases alongside each primitive so a
                 page can override with equal specificity
```

`src/css/index.css` `@import`s those three first (see `src/main.tsx`), so every
per-page stylesheet (`home.css`, `products.css`, `cart.css`, `orders.css`,
`myPage.css`, `help.css`, `navbar.css`, `footer.css`, `auth.css`,
`payment-modal.css`, `stepper.css`, `product-card.css`, `app.css`) loads after
and wins ties on equal specificity. `tokens.css` is the only file allowed a
colour literal — `src/app/MaterialTheme/index.ts` is the sole documented
exception, since MUI needs real hex values to derive its own hover/disabled
states and can't read `var(--kg-*)`.

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in development mode (Vite dev server).

### `yarn build`

Type-checks the project and builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn preview`

Serves the production build from `dist` locally, to sanity-check it before deploying.

### `yarn lint`

Runs Oxlint against the project.
