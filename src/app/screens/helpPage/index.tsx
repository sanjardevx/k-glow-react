import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Box, Container, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { ChevronDownIcon } from "../../components/icons";
import { TELEGRAM_URL } from "../../../lib/config";
import { t, useI18n, type TKey } from "../../../lib/i18n";
import "../../../css/help.css";

const terms: TKey[] = ["terms.1", "terms.2", "terms.3", "terms.4"];

const faq: { question: TKey; answer: TKey }[] = [
  { question: "faq.q1", answer: "faq.a1" },
  { question: "faq.q2", answer: "faq.a2" },
  { question: "faq.q3", answer: "faq.a3" },
  { question: "faq.q4", answer: "faq.a4" },
  { question: "faq.q5", answer: "faq.a5" },
  { question: "faq.q6", answer: "faq.a6" },
];

/**
 * The contact form. There is no mailbox behind it — the shop is run from one
 * Telegram chat, which is also where payment screenshots go — so instead of
 * posting to a dead endpoint the form writes the message, puts it on the
 * clipboard and sends the visitor to that chat to paste it. One extra tap,
 * but the message reaches a person who answers, which the old `action="#"`
 * never did: it reloaded the page and threw the text away.
 */
const contactFields = ["name", "reply", "message"] as const;
type ContactField = (typeof contactFields)[number];
type Contact = Record<ContactField, string>;
type ContactErrors = Partial<Record<ContactField, string>>;

const emptyContact: Contact = { name: "", reply: "", message: "" };

function validateContact(values: Contact): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.name.trim()) errors.name = t("contact.errName");
  if (!values.reply.trim()) errors.reply = t("contact.errReply");
  if (values.message.trim().length < 10)
    errors.message = t("contact.errMessage");
  return errors;
}

function composeMessage(values: Contact): string {
  return [
    t("contact.msgHeader"),
    "",
    `${t("contact.msgName")}: ${values.name.trim()}`,
    `${t("contact.msgReply")}: ${values.reply.trim()}`,
    "",
    values.message.trim(),
  ].join("\n");
}

/** Resolves false where the clipboard is unavailable (an insecure origin, or
 *  a browser that asks first and was refused) — the panel then tells the
 *  visitor to copy the text itself rather than claiming it was copied. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function HelpPage() {
  // Subscribes the page to language changes; the module-level t() used by
  // the helpers above reads the same current language.
  useI18n();
  const [tab, setTab] = useState("1");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Height is measured from the open answer's real content (same technique
  // as My Page's order accordion) so both the open and close transitions
  // animate the exact distance instead of racing toward a guessed max-height.
  const panelRefs = useRef<Record<number, HTMLParagraphElement | null>>({});
  const [openHeight, setOpenHeight] = useState(0);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [draft, setDraft] = useState<{ text: string; copied: boolean } | null>(
    null,
  );

  useEffect(() => {
    if (openFaq === null) return;
    const panel = panelRefs.current[openFaq];
    if (panel) setOpenHeight(panel.scrollHeight);
  }, [openFaq]);

  function handleTabChange(_e: SyntheticEvent, newValue: string) {
    setTab(newValue);
  }

  function toggleFaq(index: number) {
    setOpenFaq((prev) => (prev === index ? null : index));
  }

  function updateField(field: ContactField, value: string) {
    setContact((prev) => ({ ...prev, [field]: value }));
    // Clear the complaint as soon as they start fixing it, rather than
    // leaving it under the field until the next submit.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleContactSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const found = validateContact(contact);
    setErrors(found);
    const firstBad = contactFields.find((f) => found[f]);
    if (firstBad) {
      document.getElementById(`help-${firstBad}`)?.focus();
      return;
    }
    const text = composeMessage(contact);
    setDraft({ text, copied: await copyToClipboard(text) });
  }

  function writeAnother() {
    setDraft(null);
    setContact(emptyContact);
    setErrors({});
  }

  return (
    <div className="help-page">
      <Container className="help-container">
        <h2 className="help-title">{t("help.title")}</h2>
        <TabContext value={tab}>
          <Box className="help-tabs-frame">
            {/* Scrollable so a very narrow phone (320px) swipes instead of
                silently clipping a tab — same fix as the Orders tabs. */}
            <Tabs
              value={tab}
              onChange={handleTabChange}
              className="help-tabs"
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label={t("help.terms")} value="1" />
              <Tab label={t("help.faq")} value="2" />
              <Tab label={t("help.contact")} value="3" />
            </Tabs>
          </Box>

          <TabPanel value="1" className="help-tabpanel">
            <Box className="help-card">
              <Stack className="terms-list">
                {terms.map((line, index) => (
                  <p key={index}>{t(line)}</p>
                ))}
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value="2" className="help-tabpanel">
            <Box className="help-card">
              <Stack className="help-acc-list">
                {faq.map((item, index) => (
                  <Box
                    className={`help-acc-item${openFaq === index ? " open" : ""}`}
                    key={index}
                  >
                    <button
                      type="button"
                      className="help-acc-head"
                      onClick={() => toggleFaq(index)}
                    >
                      <span>{t(item.question)}</span>
                      <span className="help-acc-chevron">
                        <ChevronDownIcon />
                      </span>
                    </button>
                    <Box
                      className="help-acc-body"
                      style={{ maxHeight: openFaq === index ? openHeight : 0 }}
                    >
                      <p
                        className="help-acc-body-inner"
                        ref={(el: HTMLParagraphElement | null) => {
                          panelRefs.current[index] = el;
                        }}
                      >
                        {t(item.answer)}
                      </p>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value="3" className="help-tabpanel">
            <Box className="help-card help-contact-card">
              <span className="help-contact-title">{t("contact.title")}</span>
              <p className="help-contact-sub">{t("contact.sub")}</p>
              {draft ? (
                <Box className="help-draft" role="status">
                  <p className="help-draft-lead">
                    {draft.copied ? t("contact.copied") : t("contact.ready")}
                  </p>
                  <textarea
                    className="help-draft-text"
                    value={draft.text}
                    readOnly
                    rows={7}
                    aria-label={t("contact.yourMessage")}
                  />
                  <Box className="help-draft-actions">
                    <a
                      className="help-contact-submit"
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("contact.open")}
                    </a>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={async () => {
                        const copied = await copyToClipboard(draft.text);
                        setDraft({ ...draft, copied });
                      }}
                    >
                      {t("contact.copyAgain")}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={writeAnother}
                    >
                      {t("contact.another")}
                    </button>
                  </Box>
                </Box>
              ) : (
                <form className="help-contact-form" onSubmit={handleContactSubmit}>
                  <Box className="help-field">
                    <label htmlFor="help-name">{t("contact.name")}</label>
                    <input
                      id="help-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder={t("contact.namePlaceholder")}
                      value={contact.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "help-name-error" : undefined}
                    />
                    {errors.name ? (
                      <p className="field-error" id="help-name-error">
                        {errors.name}
                      </p>
                    ) : null}
                  </Box>
                  <Box className="help-field">
                    <label htmlFor="help-reply">{t("contact.reply")}</label>
                    <input
                      id="help-reply"
                      type="text"
                      name="reply"
                      placeholder={t("contact.replyPlaceholder")}
                      value={contact.reply}
                      onChange={(e) => updateField("reply", e.target.value)}
                      aria-invalid={errors.reply ? true : undefined}
                      aria-describedby={
                        errors.reply ? "help-reply-error" : "help-reply-hint"
                      }
                    />
                    {errors.reply ? (
                      <p className="field-error" id="help-reply-error">
                        {errors.reply}
                      </p>
                    ) : (
                      <p className="field-hint" id="help-reply-hint">
                        {t("contact.replyHint")}
                      </p>
                    )}
                  </Box>
                  <Box className="help-field">
                    <label htmlFor="help-message">{t("contact.message")}</label>
                    <textarea
                      id="help-message"
                      name="message"
                      placeholder={t("contact.messagePlaceholder")}
                      value={contact.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={
                        errors.message ? "help-message-error" : undefined
                      }
                    />
                    {errors.message ? (
                      <p className="field-error" id="help-message-error">
                        {errors.message}
                      </p>
                    ) : null}
                  </Box>
                  <button type="submit" className="help-contact-submit">
                    {t("contact.send")}
                  </button>
                </form>
              )}
            </Box>
          </TabPanel>
        </TabContext>
      </Container>
    </div>
  );
}
