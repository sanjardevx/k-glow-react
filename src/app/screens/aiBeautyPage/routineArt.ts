/**
 * The AI Beauty routine's pictures: one girl, drawn in SVG, doing each kind
 * of step (foam for a cleanser, a cotton pad for toner, a dropper for serum…),
 * plus simple bottle stand-ins for a product without a photo. Still images —
 * the routine only animates as it moves from one step to the next.
 *
 * Built as strings and rendered with dangerouslySetInnerHTML: the markup is
 * all ours and takes no outside input.
 */
import type { StepKind } from "../../../lib/types/routine";

type Picture = "cleanser" | "toner" | "serum" | "cream" | "sunscreen" | "mask";

/** Which picture each kind of step uses. */
const PICTURE: Record<StepKind, Picture> = {
  cleanser: "cleanser",
  oil_cleanser: "cleanser",
  toner: "toner",
  exfoliant: "toner",
  essence: "serum",
  serum: "serum",
  spot_treatment: "serum",
  eye_cream: "cream",
  moisturizer: "cream",
  other: "cream",
  sunscreen: "sunscreen",
  mask: "mask",
};

const C = {
  line: "#3a2a26", skin: "#fde6d6", skinShade: "#f6cfb9", hair: "#2f2624", hairHi: "#4a3b37",
  band: "#b9a3e3", bandDot: "#ffffff", shirt: "#5d6db0", shirtDark: "#4b5a98",
  iris: "#5466b5", blush: "#f4a3a3", lip: "#e07a8b",
};
const S = `stroke="${C.line}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`;

function eyes(kind: "open" | "wink" | "shut") {
  const open = (cx: number) => `
    <ellipse cx="${cx}" cy="96" rx="7.6" ry="8.8" fill="#fff"/>
    <ellipse cx="${cx + 0.6}" cy="97" rx="5.6" ry="7.2" fill="${C.iris}"/>
    <ellipse cx="${cx + 0.6}" cy="99" rx="5.6" ry="4.4" fill="#3d4d96" opacity=".55"/>
    <circle cx="${cx + 0.6}" cy="97.5" r="3" fill="#1d1a2b"/>
    <circle cx="${cx + 2.6}" cy="93.6" r="2" fill="#fff"/>
    <circle cx="${cx - 1.6}" cy="100.4" r="1" fill="#fff"/>
    <path d="M${cx - 9} 91.5 Q${cx} 84.5 ${cx + 9} 91" fill="none" stroke="#231a18" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M${cx + (cx < 100 ? -9 : 9)} 91.5 l${cx < 100 ? -3 : 3} -2" stroke="#231a18" stroke-width="1.8" stroke-linecap="round"/>`;
  const shut = (cx: number) => `
    <path d="M${cx - 8} 96 Q${cx} 102 ${cx + 8} 96" fill="none" stroke="#231a18" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M${cx + (cx < 100 ? -8 : 8)} 96 l${cx < 100 ? -3 : 3} -1.5" stroke="#231a18" stroke-width="1.6" stroke-linecap="round"/>`;
  if (kind === "open") return open(86) + open(114);
  if (kind === "wink") return open(86) + shut(114);
  return shut(86) + shut(114);
}

function mouth(kind: "smile" | "o") {
  if (kind === "o") return `<ellipse cx="100" cy="119" rx="3.2" ry="3.6" fill="${C.lip}" stroke="#b9566a" stroke-width="1"/>`;
  return `<path d="M94 117.5 Q100 122.5 106 117.5 Q100 120 94 117.5Z" fill="${C.lip}" stroke="#b9566a" stroke-width="1.1" stroke-linejoin="round"/>`;
}

/** A small hand, fingers together and up (or the index finger pointing),
 *  drawn at the origin and placed with transform. */
function hand(tf: string, opts: { point?: boolean } = {}) {
  const body = opts.point
    ? `<path d="M-9 8 C-11 0 -11 -8 -9 -14 C-8 -18 -3 -19 -1 -16 L-1 -32 C-1 -36 5 -36 5 -32 L5 -16 C7 -18 11 -16 11 -12 L11 -2 C11 6 6 11 0 11 C-5 11 -8 10 -9 8Z" fill="${C.skin}" ${S}/>
       <path d="M5 -14 v6" fill="none" stroke="${C.line}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>`
    : `<path d="M-9 8 C-11 0 -11 -12 -9 -24 C-8 -30 -2 -31 0 -29 C2 -32 8 -31 9 -26 C11 -24 11 -20 11 -16 L11 -2 C11 6 6 11 0 11 C-5 11 -8 10 -9 8Z" fill="${C.skin}" ${S}/>
       <path d="M-4 -28 v12 M1 -29 v13 M6 -27 v11" fill="none" stroke="${C.line}" stroke-width="1.1" stroke-linecap="round" opacity=".5"/>`;
  return `<g transform="${tf} scale(.82)">
    ${body}
    <path d="M-9 -4 C-15 -6 -17 -11 -14 -14 C-12 -16 -9 -14 -7 -11" fill="${C.skin}" ${S}/>
  </g>`;
}

interface FaceOptions {
  bg: string;
  eyes?: "open" | "wink" | "shut";
  mouth?: "smile" | "o";
  under?: string;
  over?: string;
}

function face({ bg, eyes: e = "open", mouth: m = "smile", under = "", over = "" }: FaceOptions) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="200" height="200" fill="${bg}"/>
    <circle cx="160" cy="40" r="26" fill="#fff" opacity=".35"/>
    <circle cx="34" cy="150" r="18" fill="#fff" opacity=".3"/>
    ${under}
    
    <path d="M22 214 C28 172 58 158 86 154 Q100 163 114 154 C142 158 172 172 178 214Z" fill="${C.shirt}" ${S}/>
    <path d="M86 154 Q100 168 114 154" fill="none" stroke="${C.shirtDark}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M100 180 c-3 -4 -8 -2 -6 2 l6 5 l6 -5 c2 -4 -3 -6 -6 -2z" fill="#c9b7f0"/>
    
    <path d="M90 134 V156 Q100 162 110 156 V134Z" fill="${C.skinShade}" ${S}/>
    
    <path d="M60 100 C54 62 74 40 100 40 C126 40 146 62 140 100 C136 84 128 74 118 68 H82 C72 74 64 84 60 100Z" fill="${C.hair}" ${S}/>
    <circle cx="100" cy="30" r="20" fill="${C.hair}" ${S}/>
    <path d="M88 26 c4 -8 18 -10 24 -2 M90 36 c6 4 16 4 22 -2" fill="none" stroke="${C.hairHi}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M118 16 c6 -4 12 -2 12 4" fill="none" stroke="${C.hair}" stroke-width="2.2" stroke-linecap="round"/>
    
    <ellipse cx="64" cy="100" rx="5.5" ry="8" fill="${C.skin}" ${S}/>
    <ellipse cx="136" cy="100" rx="5.5" ry="8" fill="${C.skin}" ${S}/>
    
    <path d="M64 92 C64 62 80 50 100 50 C120 50 136 62 136 92 C136 120 122 140 100 142 C78 140 64 120 64 92Z" fill="${C.skin}" ${S}/>
    
    <path d="M66 82 C70 66 84 58 98 60 C90 66 84 74 82 86 C78 80 72 79 66 82Z" fill="${C.hair}" ${S}/>
    <path d="M134 82 C130 66 116 58 102 60 C110 66 116 74 118 86 C122 80 128 79 134 82Z" fill="${C.hair}" ${S}/>
    <path d="M64 96 c-6 6 -6 16 -1 22 M136 96 c6 6 6 16 1 22" fill="none" stroke="${C.hair}" stroke-width="2.2" stroke-linecap="round"/>
    
    <path d="M62 74 C72 54 86 46 100 46 C114 46 128 54 138 74 C128 64 114 58 100 58 C86 58 72 64 62 74Z" fill="${C.band}" ${S}/>
    <g fill="${C.bandDot}" opacity=".85"><circle cx="78" cy="60" r="1.6"/><circle cx="90" cy="53" r="1.6"/><circle cx="110" cy="53" r="1.6"/><circle cx="122" cy="60" r="1.6"/><circle cx="100" cy="51" r="1.4"/></g>
    <path d="M100 47 c-8 -10 -18 -6 -14 1 c2 4 8 3 14 -1z M100 47 c8 -10 18 -6 14 1 c-2 4 -8 3 -14 -1z" fill="${C.band}" ${S}/>
    
    <path d="M78 82 Q86 78 94 81 M106 81 Q114 78 122 82" fill="none" stroke="${C.hair}" stroke-width="2" stroke-linecap="round"/>
    ${eyes(e)}
    <path d="M100 104 q-2.5 5 1 6" fill="none" stroke="#d9a58e" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="79" cy="110" rx="7.5" ry="4.2" fill="${C.blush}" opacity=".45"/>
    <ellipse cx="121" cy="110" rx="7.5" ry="4.2" fill="${C.blush}" opacity=".45"/>
    ${mouth(m)}
    ${over}
  </svg>`;
}

const foam = (pts: [number, number, number][]) =>
  pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#9cc3ea" stroke-width="1.1"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.25}" fill="#dceeff"/>`).join("");

const ART: Record<Picture, () => string> = {
  cleanser: () => face({
    bg: "#fde8ea", eyes: "shut", mouth: "smile",
    over: foam([[78,106,6],[86,113,4.5],[72,115,4],[122,106,6],[114,113,4.5],[128,115,4],[95,68,4],[104,66,5],[100,74,3]])
      + hand("translate(72 140) rotate(22)") + hand("translate(128 140) rotate(-22) scale(-1 1)")
      + foam([[150,150,5],[158,142,4],[162,154,3.5],[40,52,3.5],[48,46,2.5]]),
  }),
  toner: () => face({
    bg: "#fdeedd", eyes: "wink", mouth: "o",
    under: `<g transform="translate(32 120) rotate(-8)"><rect x="0" y="12" width="24" height="44" rx="6" fill="#f6c6d6" ${S}/><rect x="6" y="2" width="12" height="11" rx="2.5" fill="#fff" ${S}/><rect x="4" y="26" width="16" height="12" rx="2" fill="#fff" opacity=".8"/></g>`,
    over: `<ellipse cx="121" cy="108" rx="12" ry="10" fill="#fff" stroke="#b9b2aa" stroke-width="1.4"/><path d="M114 105 q7 -3 14 0 M114 110 q7 -3 14 0" fill="none" stroke="#e6e0d8" stroke-width="1.2"/>`
      + hand("translate(134 128) rotate(-28) scale(-1 1)"),
  }),
  serum: () => face({
    bg: "#e2f2ea", eyes: "open", mouth: "smile",
    over: `<g transform="translate(140 34) rotate(28)"><rect x="-7" y="0" width="14" height="14" rx="5" fill="#a65a43" ${S}/><path d="M-4.5 14 h9 l-1.4 30 a3 3 0 0 1 -6.2 0z" fill="#fff" fill-opacity=".9" ${S}/><path d="M-3 30 h6 l-.7 13 a2.3 2.3 0 0 1 -4.6 0z" fill="#f0b45b"/></g>`
      + `<path d="M124 82 c2.6 3.6 3.6 5.6 3.6 7.4 a3.6 3.6 0 0 1 -7.2 0 c0 -1.8 1 -3.8 3.6 -7.4z" fill="#f0b45b" stroke="#c98a2c" stroke-width=".8"/>`
      + `<g fill="#fff"><path d="M46 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/><path d="M160 128 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5z"/></g>`,
  }),
  cream: () => face({
    bg: "#efe8fb", eyes: "shut", mouth: "smile",
    under: `<g transform="translate(40 132) scale(.85)"><rect x="0" y="10" width="40" height="26" rx="8" fill="#bcd6f4" ${S}/><rect x="-2" y="2" width="44" height="11" rx="5" fill="#fff" ${S}/><path d="M8 0 q12 -10 24 0" fill="#fff" ${S}/></g>`,
    over: `<g fill="#fff" stroke="#c9c2ba" stroke-width="1"><circle cx="122" cy="106" r="3.6"/><circle cx="80" cy="106" r="3.4"/><circle cx="100" cy="70" r="3.2"/><circle cx="100" cy="132" r="3"/></g>`
      + hand("translate(136 130) rotate(-22) scale(-1 1)", { point: true })
      + `<g fill="#fff"><path d="M160 56 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/></g>`,
  }),
  sunscreen: () => face({
    bg: "#fff1d6", eyes: "wink", mouth: "o",
    under: `<g transform="translate(160 40)"><circle r="13" fill="#ffd36e" stroke="#e0a43a" stroke-width="1.4"/><path d="M0 -20 v-5 M0 20 v5 M-20 0 h-5 M20 0 h5 M-14 -14 l-4 -4 M14 14 l4 4 M-14 14 l-4 4 M14 -14 l4 -4" stroke="#e0a43a" stroke-width="2" stroke-linecap="round"/></g>`,
    over: `<path d="M114 106 q8 -4 14 2" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`
      + `<g transform="translate(46 168) rotate(-28)"><rect x="-10" y="-46" width="20" height="46" rx="4" fill="#fff4d8" ${S}/><rect x="-6" y="-56" width="12" height="11" rx="2" fill="#f0b45b" ${S}/><circle cx="0" cy="-26" r="5" fill="#ffd36e"/></g>`
      + hand("translate(54 168) rotate(12)")
      + hand("translate(136 130) rotate(-22) scale(-1 1)", { point: true }),
  }),
  mask: () => face({
    bg: "#e6f0fb", eyes: "shut", mouth: "smile",
    over: `<path d="M68 90 C68 66 82 56 100 56 C118 56 132 66 132 90 C132 116 120 134 100 136 C80 134 68 116 68 90Z" fill="#fff" fill-opacity=".92" stroke="#b9c9dc" stroke-width="1.4"/>
      <ellipse cx="86" cy="96" rx="9" ry="6" fill="${C.skin}"/><ellipse cx="114" cy="96" rx="9" ry="6" fill="${C.skin}"/>
      <path d="M78 96 Q86 101 94 96 M106 96 Q114 101 122 96" fill="none" stroke="#231a18" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="100" cy="119" rx="7" ry="4.5" fill="${C.skin}"/><path d="M95 118 Q100 122 105 118" fill="${C.lip}" stroke="#b9566a" stroke-width="1"/>`
      + `<g fill="#fff"><path d="M44 58 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z"/><path d="M158 132 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5z"/></g>`,
  }),
};

/* ---------- Product stand-ins (simple bottles) ---------- */
const BOTTLE: Record<Picture, string> = {
  cleanser: `<svg viewBox="0 0 60 60"><rect x="20" y="20" width="20" height="34" rx="6" fill="#f6c6d6" stroke="#3a2a26" stroke-width="1.4"/><rect x="25" y="10" width="10" height="11" rx="2" fill="#fff" stroke="#3a2a26" stroke-width="1.4"/><path d="M30 10 v-4 h8" fill="none" stroke="#3a2a26" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  toner: `<svg viewBox="0 0 60 60"><rect x="18" y="18" width="24" height="36" rx="6" fill="#d6e8fb" stroke="#3a2a26" stroke-width="1.4"/><rect x="24" y="9" width="12" height="10" rx="2" fill="#fff" stroke="#3a2a26" stroke-width="1.4"/><rect x="22" y="30" width="16" height="10" rx="2" fill="#fff"/></svg>`,
  serum: `<svg viewBox="0 0 60 60"><rect x="20" y="26" width="20" height="28" rx="5" fill="#f3d6a8" stroke="#3a2a26" stroke-width="1.4"/><rect x="24" y="16" width="12" height="11" rx="2" fill="#fff" stroke="#3a2a26" stroke-width="1.4"/><rect x="26" y="6" width="8" height="11" rx="4" fill="#a65a43" stroke="#3a2a26" stroke-width="1.4"/></svg>`,
  cream: `<svg viewBox="0 0 60 60"><rect x="12" y="28" width="36" height="22" rx="7" fill="#bcd6f4" stroke="#3a2a26" stroke-width="1.4"/><rect x="10" y="20" width="40" height="10" rx="4" fill="#fff" stroke="#3a2a26" stroke-width="1.4"/></svg>`,
  sunscreen: `<svg viewBox="0 0 60 60"><path d="M20 12 h20 l-2 38 a4 4 0 0 1 -4 4 h-8 a4 4 0 0 1 -4 -4z" fill="#fff4d8" stroke="#3a2a26" stroke-width="1.4"/><rect x="22" y="4" width="16" height="9" rx="2" fill="#f0b45b" stroke="#3a2a26" stroke-width="1.4"/><circle cx="30" cy="30" r="6" fill="#ffd36e"/></svg>`,
  mask: `<svg viewBox="0 0 60 60"><rect x="12" y="10" width="36" height="42" rx="6" fill="#d6e8fb" stroke="#3a2a26" stroke-width="1.4"/><path d="M12 18 h36" stroke="#3a2a26" stroke-width="1.4"/><ellipse cx="30" cy="34" rx="9" ry="10" fill="#fff"/></svg>`,
};

export function stepArt(kind: StepKind | undefined): string {
  return ART[PICTURE[kind ?? "other"] ?? "cream"]();
}

export function bottleArt(kind: StepKind | undefined): string {
  return BOTTLE[PICTURE[kind ?? "other"] ?? "cream"];
}
