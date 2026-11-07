/**
 * Link previews for Telegram, Instagram, WhatsApp and the like.
 *
 * The shop is a single-page app: its HTML is an empty <div> until JavaScript
 * runs, and the bots that draw a link's preview card never run it — so a
 * shared product showed up as a bare URL. vercel.json sends those bots (and
 * only them, by user agent) here instead, and this answers with a page that
 * is nothing but the Open Graph tags: the product's photo, name and price,
 * or the shop's own card for any other page.
 *
 * Shoppers never reach this; their browsers get index.html as before.
 */

const SITE_NAME = "K-Glow Secrets";
const SITE_TITLE = "K-Glow Secrets — original koreys kosmetikasi";
const SITE_DESCRIPTION =
  "Original koreys parvarish va dekorativ kosmetikasi — toʻgʻridan-toʻgʻri Seuldan, butun Oʻzbekiston boʻylab yetkazib beramiz.";

interface Product {
  _id: string;
  productBrand: string;
  productName: string;
  productPrice: number;
  productDiscount?: number;
  productVolume?: string;
  productDesc?: string;
  productImages: string[];
}

interface Preview {
  type: "website" | "product";
  title: string;
  description: string;
  image: string;
  url: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Same rounding as the storefront's formatPrice, written the Uzbek way. */
function formatPrice(product: Product): string {
  const price = product.productDiscount
    ? Math.round((product.productPrice * (100 - product.productDiscount)) / 100)
    : product.productPrice;
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0")} soʻm`;
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

async function fetchProduct(api: string, id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${api}/product/${id}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const product = (await res.json()) as Product;
    return product?._id ? product : null;
  } catch {
    // The API asleep or unreachable: fall back to the shop's own card rather
    // than leaving the bot with an error page.
    return null;
  }
}

function render(preview: Preview): string {
  const tags = [
    `<meta property="og:type" content="${preview.type}">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${escapeHtml(preview.title)}">`,
    `<meta property="og:description" content="${escapeHtml(preview.description)}">`,
    `<meta property="og:image" content="${escapeHtml(preview.image)}">`,
    `<meta property="og:url" content="${escapeHtml(preview.url)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="description" content="${escapeHtml(preview.description)}">`,
  ].join("\n    ");

  return `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(preview.title)}</title>
    ${tags}
  </head>
  <body>
    <a href="${escapeHtml(preview.url)}">${escapeHtml(preview.title)}</a>
  </body>
</html>`;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const origin = url.origin;
  const api = (process.env.VITE_SERVER_API ?? "").replace(/\/+$/, "");
  const id = url.searchParams.get("id") ?? "";

  let preview: Preview = {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    image: `${origin}/img/hero-banner.webp`,
    url: origin,
  };

  // Only a Mongo id goes into the API path — nothing a link could smuggle in.
  const product =
    api && /^[a-f0-9]{24}$/i.test(id) ? await fetchProduct(api, id) : null;
  if (product) {
    const details = [formatPrice(product), product.productVolume]
      .filter(Boolean)
      .join(" · ");
    preview = {
      type: "product",
      title: `${product.productBrand} ${product.productName}`,
      description: product.productDesc
        ? `${details} — ${truncate(product.productDesc, 150)}`
        : details,
      image: product.productImages[0]
        ? `${api}/${encodeURI(product.productImages[0])}`
        : preview.image,
      url: `${origin}/products/${product._id}`,
    };
  }

  return new Response(render(preview), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Bots ask again for every share; the edge can answer most of them.
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
