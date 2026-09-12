# K-Glow Secrets — Design System

Warm cream and sand surfaces, deep plum ink, sage green as the one restrained
brand colour, terracotta as a warm accent, Playfair Display for display
headings, Inter for everything else. This is a living reference for the
tokens and primitives — not a migration plan (the cream/sage redesign that
introduced this system is complete).

## Layer architecture

```
src/css/tokens.css       every colour/radius/shadow/type-scale value, as --kg-* custom
                          properties. The ONLY file allowed a colour literal (the sole
                          documented exception is src/app/MaterialTheme/index.ts, which
                          mirrors the same hex values because MUI needs real colours to
                          derive its own hover/disabled states).
src/css/base.css         document defaults, focus-visible ring, reduced-motion,
                          SweetAlert2 theming.
src/css/components.css   shared primitives: buttons, inputs, cards, badges, status
                          pills, chips, quantity steppers, modal shell, popover frame,
                          empty states, section headers. Page classes that already play
                          one of these roles are listed as aliases alongside the
                          primitive (e.g. `.pay-btn`, `.modal-btn`, `.pdp-addbag` all
                          share the `.btn` rule) — a new component can either add its
                          class to one of these lists or use the bare primitive
                          (`.btn`, `.card`, `.field`, `.input`, `.link`) directly.
```

`src/css/index.css` imports those three first (see `src/main.tsx`), so every
per-page stylesheet (`home.css`, `products.css`, `cart.css`, `orders.css`,
`myPage.css`, `help.css`, `navbar.css`, `footer.css`, `auth.css`,
`payment-modal.css`, `stepper.css`, `product-card.css`, `app.css`) loads after
and wins ties on equal specificity.

## Tokens

| Token | HEX | Role |
|---|---|---|
| `--kg-bg` | #faf8f4 | page background |
| `--kg-card` | #fefdfb | cards, modals, popovers |
| `--kg-sand` / `-2` | #f4eee7 / #ede5da | secondary surface, image wells / pressed |
| `--kg-border` / `-strong` | #e6dfd3 / #cfc4b4 | hairlines / inputs, outlines, steppers |
| `--kg-matte` | #ffffff | white matte behind product photos |
| `--kg-ink` | #2f1e2f | text, dark panels (14.7:1 on card) |
| `--kg-ink-soft` | #705c70 | secondary text (5.7:1) |
| `--kg-ink-faint` | #9c8b9c | icons, placeholders, disabled — never body text |
| `--kg-on-dark` / `-soft` / `-faint` | #faf8f4 / rgba .72 / rgba .55 | text on ink surfaces |
| `--kg-ink-deep` | #211521 | footer panel |
| `--kg-primary` / `-hover` / `-soft` | #3e6f58 / #345d4a / #e4f1eb | sage: the one CTA colour |
| `--kg-accent` / `-deep` / `-soft` | #ca7c68 / #a34a33 / #f9ebe7 | terracotta — accent is large-text/fills only, accent-deep is for small text (5.5:1) |
| `--kg-success` / `-soft` | = primary / primary-soft | confirmed, verified, in stock |
| `--kg-warning` / `-soft` | #956318 / #fbefda | waiting confirmation (4.5:1) |
| `--kg-danger` / `-soft` | #b12f2f / #fbe9e9 | rejected, remove, errors (5.4:1) |
| `--kg-radius-sm/-md/-lg/-pill` | 8 / 12 / 16 / 999px | badges & thumbs / inputs & rows / cards & modals / buttons, chips, pills |
| `--kg-font-display` | Playfair Display | headings ≥ 20px, product names, hero |
| `--kg-font-body` | Inter | everything else, all prices |
| `--kg-text-2xs … -4xl` | 11/12/13/14/16/20/24/32/40px | the nine-step type scale — nothing outside it |
| `--kg-text-hero` | 52px | homepage hero headline only |
| `--kg-shadow-sm/-md/-lg` | ink-tinted, never grey | popovers, card hover, modals |
| `--kg-focus-ring` | `0 0 0 3px` primary-soft | paired with the global `:focus-visible` outline in base.css |

Semantic colour is kept separate from the accent: sage on a button means "act",
sage in a pill means "confirmed". Terracotta is never a button.

A handful of icon-scale or one-off responsive values stay as plain pixels
rather than tokens (badge tags, the cart-count bubble, tooltip text, the
verified-checkmark dot, the hero's breakpoint size) — these read as
icon/glyph sizing or a single responsive override, not new body-copy sizes.

## Breakpoints

`480` / `860` / `1024` / `1200`, plus the non-width axes `(pointer: coarse)`
(raises tap targets to ≥40px), `(hover: hover)` / `(hover: none)`, and
`(prefers-reduced-motion: reduce)`.

## Contrast

Every text/surface pairing above has been checked against WCAG AA (4.5:1 for
body text, 3:1 for large text ≥24px or ≥18.66px bold). `--kg-ink-faint` is the
one token that falls short of 4.5:1 on the light surfaces (~3:1) — by design,
restricted to icons, placeholders and disabled/inactive states rather than
readable copy.

## Extending this system

- New colour → add it to `tokens.css` with its contrast ratio noted in a
  comment, never inline a hex value elsewhere.
- New button/input/card/badge → check `components.css` for an existing
  primitive first; add your class to that primitive's alias list rather than
  writing a parallel rule.
- New interactive element that isn't a real `<button>`/`<a href>` (a styled
  `<span role="button">` or similar) → give it `tabIndex={0}`,
  `onKeyDown={onActivateKey(handler)}` from `src/app/components/a11y.ts`, and
  `aria-disabled` if it has a disabled state. The global `:focus-visible` ring
  in `base.css` covers it automatically.
