import { useState } from "react";
import { Link } from "react-router-dom";
import AiService from "../../services/AiService";
import { useBasket } from "../cartPage/useBasket";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { serverApi } from "../../../lib/config";
import { useI18n, type TKey } from "../../../lib/i18n";
import { rich } from "../../../lib/i18n/rich";
import { errorMessage, showSuccess } from "../../../lib/toast";
import { Spinner } from "../../components/Loaders";
import { SparkleIcon } from "../../components/icons";
import type {
  Concern,
  Routine,
  RoutineRequest,
  RoutineStep,
  SkinType,
} from "../../../lib/types/routine";
import "../../../css/ai-beauty.css";

const SKIN_TYPES: SkinType[] = ["dry", "oily", "combination", "normal", "unsure"];
const CONCERNS: Concern[] = ["acne", "dark_spots", "dryness", "redness", "pores", "aging"];

/**
 * AI Beauty: a four-question skin quiz, then a morning and evening routine
 * that Claude builds from what the shop has in stock (see the backend's
 * Beauty.service). Every answer is a tap; the only typing is an optional
 * note. Each step can go straight into the bag, or the whole routine at once.
 */
export function AiBeautyPage() {
  const { t, lang } = useI18n();
  const { onAdd } = useBasket();

  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [sensitive, setSensitive] = useState(false);
  const [size, setSize] = useState<RoutineRequest["size"]>("simple");
  const [note, setNote] = useState("");
  const [needSkin, setNeedSkin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [routine, setRoutine] = useState<Routine | null>(null);

  function toggleConcern(c: Concern) {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  async function handleBuild() {
    if (!skinType) {
      setNeedSkin(true);
      document.getElementById("ai-q-skin")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await new AiService().buildRoutine({
        skinType,
        concerns,
        sensitive,
        size,
        note: note.trim(),
        lang,
      });
      setRoutine(result);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleAddAll() {
    if (!routine) return;
    const seen = new Set<string>();
    let added = 0;
    for (const s of [...routine.morning, ...routine.evening]) {
      const id = String(s.product._id);
      if (seen.has(id)) continue;
      seen.add(id);
      // onAdd shows the "log in first" message itself, so stop at the first no.
      if (!onAdd(s.product)) return;
      added++;
    }
    if (added) showSuccess(t("ai.addedAll", { count: added }));
  }

  function startOver() {
    setRoutine(null);
    setError("");
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="ai-page">
      <header className="ai-hero">
        <span className="eyebrow">{t("ai.eyebrow")}</span>
        <h1 className="ai-title">{rich(t("ai.title"))}</h1>
        <p className="ai-sub">{routine ? routine.summary : t("ai.sub")}</p>
      </header>

      {routine ? (
        <section className="ai-result" aria-live="polite">
          {routine.seeDermatologist ? (
            <p className="ai-derm" role="note">
              {t("ai.derm")}
            </p>
          ) : null}

          <RoutineList title={t("ai.morning")} steps={routine.morning} onAdd={onAdd} />
          <RoutineList title={t("ai.evening")} steps={routine.evening} onAdd={onAdd} />

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
            <button type="button" className="ai-secondary" onClick={startOver}>
              {t("ai.again")}
            </button>
          </div>
          <p className="ai-disclaimer">{t("ai.disclaimer")}</p>
        </section>
      ) : (
        <section className="ai-quiz">
          <fieldset className="ai-q" id="ai-q-skin">
            <legend>{t("ai.qSkin")}</legend>
            <div className="ai-chips">
              {SKIN_TYPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`ai-chip${skinType === s ? " is-on" : ""}`}
                  aria-pressed={skinType === s}
                  onClick={() => {
                    setSkinType(s);
                    setNeedSkin(false);
                  }}
                >
                  {t(`skin.${s}` as TKey)}
                </button>
              ))}
            </div>
            {needSkin ? (
              <p className="ai-field-error" role="alert">
                {t("ai.needSkin")}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="ai-q">
            <legend>
              {t("ai.qConcerns")} <span className="ai-hint">{t("ai.qConcernsHint")}</span>
            </legend>
            <div className="ai-chips">
              {CONCERNS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`ai-chip${concerns.includes(c) ? " is-on" : ""}`}
                  aria-pressed={concerns.includes(c)}
                  onClick={() => toggleConcern(c)}
                >
                  {t(`concern.${c}` as TKey)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ai-q">
            <legend>{t("ai.qSensitive")}</legend>
            <div className="ai-chips">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  className={`ai-chip${sensitive === v ? " is-on" : ""}`}
                  aria-pressed={sensitive === v}
                  onClick={() => setSensitive(v)}
                >
                  {v ? t("ai.yes") : t("ai.no")}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="ai-q">
            <legend>{t("ai.qSize")}</legend>
            <div className="ai-chips">
              {(["simple", "full"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`ai-chip${size === v ? " is-on" : ""}`}
                  aria-pressed={size === v}
                  onClick={() => setSize(v)}
                >
                  {t(`size.${v}` as TKey)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="ai-q">
            <label htmlFor="ai-note" className="ai-label">
              {t("ai.qNote")}
            </label>
            <textarea
              id="ai-note"
              className="ai-note"
              rows={2}
              maxLength={300}
              placeholder={t("ai.notePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {error ? (
            <p className="ai-field-error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            className="ai-primary ai-build"
            onClick={handleBuild}
            aria-busy={loading}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                {t("ai.building")}
              </>
            ) : (
              <>
                <SparkleIcon className="ai-build-icon" />
                {t("ai.build")}
              </>
            )}
          </button>
          {loading ? <p className="ai-wait">{t("ai.buildingSub")}</p> : null}
          <p className="ai-disclaimer">{t("ai.disclaimer")}</p>
        </section>
      )}
    </div>
  );
}

interface RoutineListProps {
  title: string;
  steps: RoutineStep[];
  onAdd: ReturnType<typeof useBasket>["onAdd"];
}

/** One half of the routine: numbered steps, each a real product card. */
function RoutineList({ title, steps, onAdd }: RoutineListProps) {
  const { t } = useI18n();
  if (!steps.length) return null;

  return (
    <div className="ai-routine">
      <h2 className="ai-section-title">{title}</h2>
      <ol className="ai-steps">
        {steps.map((s, i) => (
          <li className="ai-step" key={`${s.product._id}-${i}`}>
            <span className="ai-step-num" aria-hidden="true">
              {i + 1}
            </span>
            <Link to={`/products/${s.product._id}`} className="ai-step-photo">
              <img src={`${serverApi}/${s.product.productImages[0]}`} alt="" />
            </Link>
            <div className="ai-step-body">
              <span className="ai-step-name">{s.step}</span>
              <Link to={`/products/${s.product._id}`} className="ai-step-product">
                <span className="ai-step-brand">{s.product.productBrand}</span>
                {s.product.productName}
              </Link>
              <p className="ai-step-why">{s.why}</p>
              <p className="ai-step-how">{s.howToUse}</p>
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
