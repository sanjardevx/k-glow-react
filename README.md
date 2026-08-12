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
