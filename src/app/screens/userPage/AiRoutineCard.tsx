import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AiService from "../../services/AiService";
import { plural, useI18n, type TKey } from "../../../lib/i18n";
import { ChevronRightIcon, SparkleIcon } from "../../components/icons";
import type { Routine } from "../../../lib/types/routine";
import { routineProducts } from "../aiBeautyPage/routineProducts";

/**
 * My Page's way back to the member's AI Beauty routine — or, before they
 * have one, an invitation to make it.
 */
export function AiRoutineCard() {
  const { t } = useI18n();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    new AiService()
      .getStatus()
      .then((s) => {
        if (!cancelled) setRoutine(s.routine);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return null;
  const count = routine ? routineProducts(routine).length : 0;

  return (
    <Link
      to={routine ? "/ai-beauty?view=routine" : "/ai-beauty"}
      className="mypage-ai-card"
    >
      <span className="mypage-ai-icon" aria-hidden="true">
        <SparkleIcon />
      </span>
      <span className="mypage-ai-text">
        <span className="mypage-ai-title">
          {routine ? t("me.aiRoutine") : t("me.aiRoutineEmpty")}
        </span>
        <span className="mypage-ai-sub">
          {routine
            ? `${t(`skin.${routine.answers.skinType}` as TKey)} · ${count} ${plural("shop.productNoun", count)}`
            : t("me.aiRoutineEmptySub")}
        </span>
      </span>
      <ChevronRightIcon className="mypage-ai-chevron" />
    </Link>
  );
}
