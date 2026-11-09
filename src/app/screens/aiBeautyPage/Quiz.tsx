import { useState } from "react";
import AiService from "../../services/AiService";
import { useI18n, type TKey } from "../../../lib/i18n";
import { errorMessage } from "../../../lib/toast";
import { Spinner } from "../../components/Loaders";
import { SparkleIcon } from "../../components/icons";
import type {
  Concern,
  Routine,
  RoutineRequest,
  SkinType,
} from "../../../lib/types/routine";

const SKIN_TYPES: SkinType[] = ["dry", "oily", "combination", "normal", "unsure"];
const CONCERNS: Concern[] = ["acne", "dark_spots", "dryness", "redness", "pores", "aging"];

interface QuizProps {
  /** Answers left today; at 0 the button can't send. */
  left: number;
  onBuilt: (routine: Routine) => void;
  /** The server said the day is used up. */
  onLimit: () => void;
}

/**
 * The four-question skin quiz. Every answer is a tap; the only typing is an
 * optional note. Skin type is the one required answer.
 */
export function Quiz({ left, onBuilt, onLimit }: QuizProps) {
  const { t, lang } = useI18n();

  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [sensitive, setSensitive] = useState(false);
  const [size, setSize] = useState<RoutineRequest["size"]>("simple");
  const [note, setNote] = useState("");
  const [needSkin, setNeedSkin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleConcern(c: Concern) {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  async function handleBuild() {
    if (loading || left <= 0) return;
    if (!skinType) {
      setNeedSkin(true);
      document
        .getElementById("ai-q-skin")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const routine = await new AiService().buildRoutine({
        skinType,
        concerns,
        sensitive,
        size,
        note: note.trim(),
        lang,
      });
      onBuilt(routine);
    } catch (err) {
      if ((err as { response?: { status?: number } })?.response?.status === 429)
        onLimit();
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
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
        disabled={loading || left <= 0}
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
    </section>
  );
}
