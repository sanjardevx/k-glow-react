/**
 * sitemap.xml for search engines: the shop's public pages and every product
 * that is on sale, read live from the API so a new product shows up without
 * a redeploy. vercel.json maps /sitemap.xml here; robots.txt points to it.
 *
 * Addresses are always on the shop's own domain, whichever address the
 * request came in on, so Google indexes kglowshop.uz only.
 */

const SITE = "https://www.kglowshop.uz";

/** Public pages worth indexing. Cart, orders and My Page are private. */
const PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/products", priority: "0.9", changefreq: "daily" },
  { path: "/ai-beauty", priority: "0.6", changefreq: "monthly" },
  { path: "/live-tutorials", priority: "0.6", changefreq: "weekly" },
  { path: "/help", priority: "0.4", changefreq: "monthly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
];

interface Product {
  _id: string;
  updatedAt?: string;
}

const PAGE_SIZE = 100; // the API's largest page

async function fetchProducts(api: string): Promise<Product[]> {
  const all: Product[] = [];
  try {
    for (let page = 1; page <= 20; page++) {
      const res = await fetch(
        `${api}/product/all?page=${page}&limit=${PAGE_SIZE}&order=createdAt`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (!res.ok) break;
      const list = (await res.json()) as Product[];
      all.push(...list.filter((p) => /^[a-f0-9]{24}$/i.test(p?._id)));
      if (list.length < PAGE_SIZE) break;
    }
  } catch {
    // The API unreachable: still answer with the fixed pages.
  }
  return all;
}

function url(loc: string, extra: string): string {
  return `  <url><loc>${loc}</loc>${extra}</url>`;
}

export async function GET(): Promise<Response> {
  const api = (process.env.VITE_SERVER_API ?? "").replace(/\/+$/, "");
  const products = api ? await fetchProducts(api) : [];

  const lines = [
    ...PAGES.map((p) =>
      url(
        `${SITE}${p.path === "/" ? "/" : p.path}`,
        `<changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority>`,
      ),
    ),
    ...products.map((p) =>
      url(
        `${SITE}/products/${p._id}`,
        `${p.updatedAt ? `<lastmod>${p.updatedAt.slice(0, 10)}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>0.8</priority>`,
      ),
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Search engines read it rarely; an hour at the edge is plenty fresh.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
