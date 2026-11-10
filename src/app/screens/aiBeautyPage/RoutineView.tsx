import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBasket } from "../cartPage/useBasket";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { serverApi, TELEGRAM_URL } from "../../../lib/config";
import { useI18n, type TKey } from "../../../lib/i18n";
import { showSuccess } from "../../../lib/toast";
import { BagIcon, MoonIcon, SendIcon, SunIcon } from "../../components/icons";
import type { Routine, RoutineStep } from "../../../lib/types/routine";
import type { Product } from "../../../lib/types/product";
import { routineProducts } from "./routineProducts";
import { bottleArt, stepArt } from "./routineArt";

type T = ReturnType<typeof useI18n>["t"];

/** "Brand Name", unless the name already starts with the brand. */
function withBrand(p: Product) {
  return p.productName.toLowerCase().includes(p.productBrand.toLowerCase())
    ? p.productName
    : `${p.productBrand} ${p.productName}`;
}

/**
 * A Telegram link to the shop's DM with the order already typed — customers
 * order by message anyway, so this saves them listing the products by hand.
 */
function telegramLink(products: Product[], t: T) {
  const total = products.reduce((sum, p) => sum + finalPrice(p), 0);
  const lines =
    products.length === 1
      ? [t("ai.tgOne"), "", `${withBrand(products[0])} — ${formatPrice(finalPrice(products[0]))}`]
      : [
          t("ai.tgIntro"),
          "",
          ...products.map(
            (p, i) => `${i + 1}. ${withBrand(p)} — ${formatPrice(finalPrice(p))}`,
          ),
          "",
          t("ai.tgTotal", { total: formatPrice(total) }),
        ];
  return `${TELEGRAM_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
}

interface RoutineViewProps {
  routine: Routine;
  onStartOver: () => void;
}

/**
 * The routine as a picture guide: who it's for in one line, a Morning /
 * Evening switch, then the steps going down the page — each a drawing of the
 * step being done, a plain "why" and "how", and an arrow across to the
 * product to buy for it.
 */
export function RoutineView({ routine, onStartOver }: RoutineViewProps) {
  const { t } = useI18n();
  const { onAdd } = useBasket();
  const { answers } = routine;

  const hasMorning = routine.morning.length > 0;
  const hasEvening = routine.evening.length > 0;
  const [when, setWhen] = useState<"morning" | "evening">(
    hasMorning ? "morning" : "evening",
  );
  const steps = when === "morning" ? routine.morning : routine.evening;

  const goal = answers.concerns.length
    ? answers.concerns.map((c) => t(`concern.${c}` as TKey)).join(", ")
    : t("ai.goalNone");

  function handleAddAll() {
    let added = 0;
    for (const p of routineProducts(routine)) {
      // onAdd shows the "log in first" message itself, so stop at the first no.
      if (!onAdd(p)) return;
      added++;
    }
    if (added) showSuccess(t("ai.addedAll", { count: added }));
  }

  return (
    <section className="ai-result is-guide" aria-live="polite">
      <div className="ai-profile">
        <span className="ai-profile-item">
          <span className="ai-profile-label">{t("ai.yourSkin")}</span>
          {t(`skin.${answers.skinType}` as TKey)}
          {answers.sensitive ? ` · ${t("ai.sensitive")}` : ""}
        </span>
        <span className="ai-profile-item">
          <span className="ai-profile-label">{t("ai.goal")}</span>
          {goal}
        </span>
      </div>

      <p className="ai-summary">{routine.summary}</p>

      {routine.seeDermatologist ? (
        <p className="ai-derm" role="note">
          {t("ai.derm")}
        </p>
      ) : null}

      {hasMorning && hasEvening ? (
        <div className="rt-tabs" role="tablist">
          {(["morning", "evening"] as const).map((w) => {
            const Icon = w === "morning" ? SunIcon : MoonIcon;
            return (
              <button
                key={w}
                type="button"
                role="tab"
                aria-selected={when === w}
                className={`rt-tab${when === w ? " is-on" : ""}`}
                onClick={() => setWhen(w)}
              >
                <Icon className="rt-tab-icon" />
                {t(w === "morning" ? "ai.morning" : "ai.evening")}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Keyed, so switching Morning / Evening plays the steps in again. */}
      <StepFlow key={when} steps={steps} t={t} onAdd={onAdd} />

      {routine.tips.length ? (
        <div className="ai-tips">
          <h2 className="ai-section-title">{t("ai.tips")}</h2>
          <ul>
            {routine.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="ai-actions">
        <button type="button" className="ai-primary" onClick={handleAddAll}>
          {t("ai.addAll")}
        </button>
        <a
          className="ai-secondary ai-telegram"
          href={telegramLink(routineProducts(routine), t)}
          target="_blank"
          rel="noreferrer"
        >
          <SendIcon className="ai-btn-icon" />
          {t("ai.orderTg")}
        </a>
        <button type="button" className="ai-text-btn" onClick={onStartOver}>
          {t("ai.again")}
        </button>
      </div>
      <p className="ai-disclaimer">{t("ai.disclaimer")}</p>
    </section>
  );
}

const STAGE_MS = 480;

/**
 * The steps, revealed one after another: the step, then the arrow across to
 * its product and the product, then the arrow down to the next step. That
 * hand-off is the only motion; the drawings themselves stay still. With
 * reduced motion everything is simply there.
 */
function StepFlow({
  steps,
  t,
  onAdd,
}: {
  steps: RoutineStep[];
  t: T;
  onAdd: ReturnType<typeof useBasket>["onAdd"];
}) {
  const total = steps.length * 3;
  const [stage, setStage] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? total : 0,
  );

  useEffect(() => {
    if (stage >= total) return;
    const id = window.setTimeout(
      () => setStage((s) => s + 1),
      stage === 0 ? 120 : STAGE_MS,
    );
    return () => window.clearTimeout(id);
  }, [stage, total]);

  return (
    <ol className="rt-flow">
      {steps.map((s, i) => {
        const shown = stage > i * 3;
        const linked = stage > i * 3 + 1;
        const drawn = stage > i * 3 + 2;
        return (
          <li key={`${s.product._id}-${i}`} className="rt-item">
            <div
              className={`rt-step${shown ? " is-in" : ""}${linked ? " is-linked" : ""}`}
            >
              <div
                className="rt-pic"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: stepArt(s.kind) }}
              />
              <div className="rt-text">
                <span className="rt-num">{t("ai.stepN", { n: i + 1 })}</span>
                <h3 className="rt-title">{s.step}</h3>
                <p className="rt-why">{s.why}</p>
                <p className="rt-how">
                  <strong>{t("ai.how")}:</strong> {s.howToUse}
                </p>
              </div>
              <span className="rt-across" aria-hidden="true" />
              <ProductCard step={s} n={i + 1} t={t} onAdd={onAdd} />
            </div>
            {i < steps.length - 1 ? (
              <svg
                className={`rt-down${drawn ? " is-drawn" : ""}`}
                viewBox="0 0 190 78"
                aria-hidden="true"
              >
                <path d="M95 4 C97 26 108 40 101 56 C98 63 92 68 88 72" />
                <path className="rt-down-head" d="M86 62 L87 73 L97 70" />
                <path
                  className="rt-down-mask"
                  d="M95 4 C97 26 108 40 101 56 C98 63 92 68 88 72"
                />
              </svg>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/** The product for one step: photo (or a drawn stand-in), name, price,
 *  straight to the bag or to a Telegram order. */
function ProductCard({
  step,
  n,
  t,
  onAdd,
}: {
  step: RoutineStep;
  n: number;
  t: T;
  onAdd: ReturnType<typeof useBasket>["onAdd"];
}) {
  const p = step.product;
  const [photoFailed, setPhotoFailed] = useState(!p.productImages?.[0]);

  return (
    <div className="rt-card">
      <Link to={`/products/${p._id}`} className="rt-photo">
        <span className="rt-photo-num" aria-hidden="true">
          {n}
        </span>
        {photoFailed ? (
          <span
            className="rt-bottle"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: bottleArt(step.kind) }}
          />
        ) : (
          <img
            src={`${serverApi}/${p.productImages[0]}`}
            alt=""
            loading="lazy"
            onError={() => setPhotoFailed(true)}
          />
        )}
      </Link>
      <div className="rt-card-body">
        <span className="ai-step-brand">{p.productBrand}</span>
        <Link to={`/products/${p._id}`} className="rt-card-name">
          {p.productName}
        </Link>
        <span className="ai-step-price">{formatPrice(finalPrice(p))}</span>
      </div>
      <div className="rt-card-btns">
        <button
          type="button"
          className="rt-btn is-add"
          onClick={() => {
            if (onAdd(p)) showSuccess(t("pdp.added"));
          }}
        >
          <BagIcon className="rt-btn-icon" />
          {t("card.addToCart")}
        </button>
        <a
          className="rt-btn is-tg"
          href={telegramLink([p], t)}
          target="_blank"
          rel="noreferrer"
        >
          <SendIcon className="rt-btn-icon" />
          Telegram
        </a>
      </div>
    </div>
  );
}
