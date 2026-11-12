import { type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AiService from "../../services/AiService";
import { useGlobals } from "../../context/useGlobals";
import { plural, useI18n, type TKey } from "../../../lib/i18n";
import { rich } from "../../../lib/i18n/rich";
import type { AuthMode } from "../../components/auth";
import {
  ArrowLeftIcon,
  ChatIcon,
  ChevronRightIcon,
  ListIcon,
  SparkleIcon,
} from "../../components/icons";
import type { AiStatus, ChatMessage, Routine } from "../../../lib/types/routine";
import { Quiz } from "./Quiz";
import { Chat } from "./Chat";
import { RoutineView } from "./RoutineView";
import { routineProducts } from "./routineProducts";
import "../../../css/ai-beauty.css";

type View = "start" | "quiz" | "chat" | "routine";

const DEFAULT_LIMIT = 5;

interface AiBeautyPageProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/**
 * AI Beauty, for signed-in members. It starts by asking how they'd like to
 * go: the short quiz (four taps → a routine) or a direct question in a chat.
 * Both only suggest products in stock. Each answer uses one of the day's
 * tries, and the latest routine is kept so it can be opened again (from here
 * or from My Page, which links to ?view=routine).
 *
 * Guests see what it does, and every way in opens the login.
 */
export function AiBeautyPage({ onAuthOpen }: AiBeautyPageProps) {
  const { t } = useI18n();
  const { authMember } = useGlobals();
  const location = useLocation();

  const [view, setView] = useState<View>("start");
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetched on arrival and again after logging in here; a guest has none.
  useEffect(() => {
    if (!authMember) {
      setStatus(null);
      setView("start");
      return;
    }
    let cancelled = false;
    new AiService()
      .getStatus()
      .then((s) => {
        if (cancelled) return;
        setStatus(s);
        setRoutine(s.routine);
        if (s.routine && new URLSearchParams(location.search).get("view") === "routine")
          setView("routine");
      })
      .catch(() => {
        // Leave the page usable; the server still enforces the limit.
        if (!cancelled) setStatus({ limit: DEFAULT_LIMIT, left: DEFAULT_LIMIT, routine: null });
      });
    return () => {
      cancelled = true;
    };
    // location.search only matters on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMember]);

  const limit = status?.limit ?? DEFAULT_LIMIT;
  const left = status?.left ?? DEFAULT_LIMIT;
  const setLeft = (n: number) =>
    setStatus((s) => ({ limit, routine: s?.routine ?? null, left: n }));

  function go(next: View) {
    if (!authMember) {
      onAuthOpen("login");
      return;
    }
    setView(next);
    window.scrollTo({ top: 0 });
  }

  function handleBuilt(r: Routine) {
    setRoutine(r);
    if (typeof r.left === "number") setLeft(r.left);
    setView("routine");
    window.scrollTo({ top: 0 });
  }

  const sub =
    view === "quiz"
      ? t("ai.quizSub")
      : view === "chat"
        ? t("ai.chatSub")
        : view === "routine"
          ? t("ai.routineSub")
          : t("ai.sub");

  return (
    <div className={`ai-page is-${view}`}>
      <header className="ai-hero">
        {view !== "start" ? (
          <button type="button" className="ai-back" onClick={() => go("start")}>
            <ArrowLeftIcon className="ai-back-icon" />
            {t("ai.back")}
          </button>
        ) : null}
        <span className="eyebrow">{t("ai.eyebrow")}</span>
        <h1 className="ai-title">{rich(t("ai.title"))}</h1>
        <p className="ai-sub">{sub}</p>
        {authMember && status ? (
          <p className={`ai-left${left <= 0 ? " is-empty" : ""}`}>
            {left > 0 ? t("ai.left", { left, limit }) : t("ai.noneLeft")}
          </p>
        ) : null}
      </header>

      {view === "start" ? (
        <section className="ai-start">
          {!authMember ? (
            <div className="ai-login">
              <div>
                <p className="ai-login-title">{t("ai.loginTitle")}</p>
                <p className="ai-login-sub">{t("ai.loginSub", { limit })}</p>
              </div>
              <button
                type="button"
                className="ai-primary"
                onClick={() => onAuthOpen("login")}
              >
                {t("ai.loginBtn")}
              </button>
            </div>
          ) : null}

          <p className="ai-start-title">{t("ai.chooseTitle")}</p>
          <div className="ai-choices">
            <ChoiceCard
              icon={<ListIcon />}
              title={t("ai.quizCard")}
              sub={t("ai.quizCardSub")}
              onClick={() => go("quiz")}
            />
            <ChoiceCard
              icon={<ChatIcon />}
              title={messages.length ? t("ai.chatContinue") : t("ai.chatCard")}
              sub={t("ai.chatCardSub")}
              onClick={() => go("chat")}
            />
          </div>

          {authMember && routine ? (
            <ChoiceCard
              className="is-saved"
              icon={<SparkleIcon />}
              title={t("ai.savedCard")}
              sub={`${t(`skin.${routine.answers.skinType}` as TKey)} · ${
                routineProducts(routine).length
              } ${plural("shop.productNoun", routineProducts(routine).length)}`}
              onClick={() => go("routine")}
            />
          ) : null}
          <p className="ai-disclaimer">{t("ai.disclaimer")}</p>
        </section>
      ) : null}

      {view === "quiz" ? (
        <Quiz left={left} onBuilt={handleBuilt} onLimit={() => setLeft(0)} />
      ) : null}

      {view === "chat" ? (
        <Chat
          messages={messages}
          onMessages={setMessages}
          left={left}
          limit={limit}
          onLeft={setLeft}
        />
      ) : null}

      {view === "routine" && routine ? (
        <RoutineView routine={routine} onStartOver={() => go("quiz")} />
      ) : null}
    </div>
  );
}

function ChoiceCard({
  icon,
  title,
  sub,
  onClick,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button type="button" className={`ai-choice ${className}`} onClick={onClick}>
      <span className="ai-choice-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="ai-choice-text">
        <span className="ai-choice-title">{title}</span>
        <span className="ai-choice-sub">{sub}</span>
      </span>
      <ChevronRightIcon className="ai-choice-chevron" />
    </button>
  );
}
