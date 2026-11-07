import { Fragment, type ReactNode } from "react";

/**
 * Renders the two bits of markup a dictionary value may carry: `<em>…</em>`
 * for the italic accent in headings and `<br>` for a line break. Only these —
 * values are never parsed as HTML. Where the accent falls is up to each
 * language: "Best<em>sellers</em>" and "Eng koʻp <em>sotilganlar</em>".
 */
export function rich(text: string): ReactNode {
  return text.split(/(<em>.*?<\/em>|<br>)/).map((part, i) => {
    if (part === "<br>") return <br key={i} />;
    const em = /^<em>(.*)<\/em>$/.exec(part);
    if (em) return <em key={i}>{em[1]}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
