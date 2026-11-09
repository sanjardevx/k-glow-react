import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AiService from "../../services/AiService";
import { useBasket } from "../cartPage/useBasket";
import { finalPrice, formatPrice } from "../productsPage/productsData";
import { serverApi } from "../../../lib/config";
import { useI18n, type TKey } from "../../../lib/i18n";
import { errorMessage, showSuccess } from "../../../lib/toast";
import { SendIcon, SparkleIcon } from "../../components/icons";
import type { ChatMessage } from "../../../lib/types/routine";
import type { Product } from "../../../lib/types/product";

const SUGGESTIONS: TKey[] = [
  "ai.chatSuggest1",
  "ai.chatSuggest2",
  "ai.chatSuggest3",
  "ai.chatSuggest4",
];

interface ChatProps {
  messages: ChatMessage[];
  onMessages: (messages: ChatMessage[]) => void;
  left: number;
  limit: number;
  onLeft: (left: number) => void;
}

/**
 * Direct questions. Answers are short, in plain words, with up to four
 * product cards from the shop. Ready-made questions save typing; each answer
 * uses one of the day's tries.
 */
export function Chat({ messages, onMessages, left, limit, onLeft }: ChatProps) {
  const { t, lang } = useI18n();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep the newest message (or the "thinking" bubble) in view.
  useEffect(() => {
    if (messages.length || busy)
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, busy]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy || left <= 0) return;

    const before = messages;
    const next: ChatMessage[] = [...messages, { role: "user", content: question }];
    onMessages(next);
    setDraft("");
    setError("");
    setBusy(true);
    try {
      const answer = await new AiService().chat(next, lang);
      onMessages([
        ...next,
        { role: "assistant", content: answer.reply, products: answer.products },
      ]);
      onLeft(answer.left);
    } catch (err) {
      // Take the question back out and return it to the box, so trying
      // again is one tap.
      onMessages(before);
      setDraft(question);
      if ((err as { response?: { status?: number } })?.response?.status === 429)
        onLeft(0);
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(draft);
  }

  const outOfAnswers = left <= 0;

  return (
    <section className="ai-chat" aria-label={t("ai.chatAria")}>
      <div className="ai-chat-log" role="log" aria-live="polite">
        <div className="ai-bubble is-assistant">
          <span className="ai-avatar" aria-hidden="true">
            <SparkleIcon />
          </span>
          <p>{t("ai.chatHello")}</p>
        </div>

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div className="ai-bubble is-user" key={i}>
              <p>{m.content}</p>
            </div>
          ) : (
            <div className="ai-bubble is-assistant" key={i}>
              <span className="ai-avatar" aria-hidden="true">
                <SparkleIcon />
              </span>
              <div className="ai-bubble-body">
                <p>{m.content}</p>
                {m.products?.length ? <ChatProducts products={m.products} /> : null}
              </div>
            </div>
          ),
        )}

        {busy ? (
          <div className="ai-bubble is-assistant is-thinking">
            <span className="ai-avatar" aria-hidden="true">
              <SparkleIcon />
            </span>
            <p>
              <span className="ai-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="kg-visually-hidden">{t("ai.chatThinking")}</span>
            </p>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      {!messages.length && !busy && !outOfAnswers ? (
        <div className="ai-suggest">
          {SUGGESTIONS.map((key) => (
            <button
              key={key}
              type="button"
              className="ai-chip"
              onClick={() => send(t(key))}
            >
              {t(key)}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="ai-field-error" role="alert">
          {error}
        </p>
      ) : null}

      <form className="ai-chat-form" onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className="ai-chat-input"
          rows={1}
          maxLength={1000}
          value={draft}
          disabled={outOfAnswers}
          placeholder={outOfAnswers ? t("ai.noneLeft") : t("ai.chatPlaceholder")}
          aria-label={t("ai.chatPlaceholder")}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends; Shift+Enter (or the phone's return key with
            // Shift) makes a new line.
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send(draft);
            }
          }}
        />
        <button
          type="submit"
          className="ai-send"
          disabled={busy || outOfAnswers || !draft.trim()}
          aria-label={t("ai.chatSend")}
        >
          <SendIcon />
        </button>
      </form>
      <p className="ai-chat-note">{t("ai.chatCost", { limit })}</p>
    </section>
  );
}

/** The products an answer suggested, as small cards that go straight into
 *  the bag. */
function ChatProducts({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const { onAdd } = useBasket();

  return (
    <ul className="ai-chat-products">
      {products.map((p) => (
        <li key={String(p._id)} className="ai-chat-product">
          <Link to={`/products/${p._id}`} className="ai-chat-photo">
            <img src={`${serverApi}/${p.productImages[0]}`} alt="" />
          </Link>
          <div className="ai-chat-product-body">
            <Link to={`/products/${p._id}`} className="ai-chat-product-name">
              <span className="ai-step-brand">{p.productBrand}</span>
              {p.productName}
            </Link>
            <div className="ai-chat-product-foot">
              <span className="ai-step-price">{formatPrice(finalPrice(p))}</span>
              <button
                type="button"
                className="ai-step-add"
                onClick={() => {
                  if (onAdd(p)) showSuccess(t("pdp.added"));
                }}
              >
                {t("card.addToCart")}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
