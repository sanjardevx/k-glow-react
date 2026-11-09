import { Link } from "react-router-dom";
import { useBasket } from "../cartPage/useBasket";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { serverApi, TELEGRAM_URL } from "../../../lib/config";
import { plural, useI18n, type TKey } from "../../../lib/i18n";
import { showSuccess } from "../../../lib/toast";
import { MoonIcon, SendIcon, SunIcon } from "../../components/icons";
import type { Routine, RoutineStep } from "../../../lib/types/routine";
import type { Product } from "../../../lib/types/product";
import { routineProducts } from "./routineProducts";

/**
 * A Telegram link to the shop's DM with the order already typed — customers
 * order by message anyway, so this saves them listing the products by hand.
 */
function telegramOrderLink(routine: Routine, t: ReturnType<typeof useI18n>["t"]) {
  const products = routineProducts(routine);
  const total = products.reduce((sum, p) => sum + finalPrice(p), 0);
  const lines = [
    t("ai.tgIntro"),
    "",
    ...products.map(
      (p, i) =>
        `${i + 1}. ${withBrand(p)} — ${formatPrice(finalPrice(p))}`,
    ),
    "",
    t("ai.tgTotal", { total: formatPrice(total) }),
  ];
  return `${TELEGRAM_URL}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** "Brand Name", unless the name already starts with the brand. */
function withBrand(p: Product) {
  return p.productName.toLowerCase().includes(p.productBrand.toLowerCase())
    ? p.productName
    : `${p.productBrand} ${p.productName}`;
}

interface RoutineViewProps {
  routine: Routine;
  onStartOver: () => void;
}

/** The routine: who it's for in one line, then numbered morning and evening
 *  steps, each a real product card with a plain "why" and "how to use". */
export function RoutineView({ routine, onStartOver }: RoutineViewProps) {
  const { t } = useI18n();
  const { onAdd } = useBasket();
  const { answers } = routine;

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
    <section className="ai-result" aria-live="polite">
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

      <RoutineList when="morning" steps={routine.morning} />
      <RoutineList when="evening" steps={routine.evening} />

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
          href={telegramOrderLink(routine, t)}
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

/** One half of the routine: numbered steps, each a real product card. */
function RoutineList({
  when,
  steps,
}: {
  when: "morning" | "evening";
  steps: RoutineStep[];
}) {
  const { t } = useI18n();
  const { onAdd } = useBasket();
  if (!steps.length) return null;
  const Icon = when === "morning" ? SunIcon : MoonIcon;

  return (
    <div className={`ai-routine is-${when}`}>
      <h2 className="ai-section-title">
        <span className="ai-when-icon" aria-hidden="true">
          <Icon />
        </span>
        {t(when === "morning" ? "ai.morning" : "ai.evening")}
        <span className="ai-section-count">
          {steps.length} {plural("ai.stepNoun", steps.length)}
        </span>
      </h2>
      <ol className="ai-steps">
        {steps.map((s, i) => (
          <li className="ai-step" key={`${s.product._id}-${i}`}>
            <Link to={`/products/${s.product._id}`} className="ai-step-photo">
              <img src={`${serverApi}/${s.product.productImages[0]}`} alt="" />
              <span className="ai-step-num" aria-hidden="true">
                {i + 1}
              </span>
            </Link>
            <div className="ai-step-body">
              <span className="ai-step-name">
                {t("ai.stepN", { n: i + 1 })} · {s.step}
              </span>
              <Link to={`/products/${s.product._id}`} className="ai-step-product">
                <span className="ai-step-brand">{s.product.productBrand}</span>
                {s.product.productName}
              </Link>
              <p className="ai-step-why">{s.why}</p>
              <p className="ai-step-how">
                <strong>{t("ai.how")}:</strong> {s.howToUse}
              </p>
              <div className="ai-step-foot">
                <span className="ai-step-price">
                  {formatPrice(finalPrice(s.product))}
                </span>
                <button
                  type="button"
                  className="ai-step-add"
                  onClick={() => {
                    if (onAdd(s.product)) showSuccess(t("pdp.added"));
                  }}
                >
                  {t("card.addToCart")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
