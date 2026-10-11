import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Box, Container, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { ChevronDownIcon } from "../../components/icons";
import { TELEGRAM_URL } from "../../../lib/config";
import "../../../css/help.css";

const terms = [
  "Browsing is open to everyone, but you'll need to log in (or sign up) to add items to your bag and check out.",
  "Once you've submitted your transfer screenshot, the order can't be cancelled — please double-check your bag before paying.",
  "Most products ship directly from Korea, so delivery can take longer than a local order — we'll always give you a realistic estimate.",
  "Please keep messages to our team respectful — we're a small team doing our best to help you glow.",
];

const faq = [
  {
    question: "How do I place an order?",
    answer:
      "— Add items to your bag, log in (or sign up), tap Pay, then send us your transfer screenshot — we'll confirm your order shortly after.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "— Most items ship from Korea, so please allow extra time — we'll share a realistic estimate once your order is confirmed.",
  },
  {
    question: "Is my personal information safe?",
    answer:
      "— Yes. We only use your details to process and deliver your order — nothing else.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "— Before you submit your payment screenshot, yes. After that, orders can't be cancelled since we've already started processing them.",
  },
  {
    question: "What if my payment isn't confirmed?",
    answer:
      "— Double-check the transfer note and screenshot you sent. If something looks off, contact us and we'll sort it out together.",
  },
  {
    question: "Who do I contact for help?",
    answer: "— Use the Contact tab below, or message us directly on Telegram.",
  },
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
  if (!values.name.trim()) errors.name = "Please tell us your name.";
  if (!values.reply.trim())
    errors.reply = "Add an email or Telegram so we can reply.";
  if (values.message.trim().length < 10)
    errors.message = "Please write a little more so we can help.";
  return errors;
}

function composeMessage(values: Contact): string {
  return [
    "Message from the K-Glow website",
    "",
    `Name: ${values.name.trim()}`,
    `Reply to: ${values.reply.trim()}`,
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
        <h2 className="help-title">Help</h2>
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
              <Tab label="Terms" value="1" />
              <Tab label="FAQ" value="2" />
              <Tab label="Contact" value="3" />
            </Tabs>
          </Box>

          <TabPanel value="1" className="help-tabpanel">
            <Box className="help-card">
              <Stack className="terms-list">
                {terms.map((line, index) => (
                  <p key={index}>{line}</p>
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
                      <span>{item.question}</span>
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
                        {item.answer}
                      </p>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </TabPanel>

          <TabPanel value="3" className="help-tabpanel">
            <Box className="help-card help-contact-card">
              <span className="help-contact-title">Contact us!</span>
              <p className="help-contact-sub">
                Write your message here and we'll hand it to our Telegram chat,
                where a person reads and answers it.
              </p>
              {draft ? (
                <Box className="help-draft" role="status">
                  <p className="help-draft-lead">
                    {draft.copied
                      ? "Your message is copied. Open the chat and paste it in — that's it."
                      : "Your message is ready. Copy it below, then paste it into the chat."}
                  </p>
                  <textarea
                    className="help-draft-text"
                    value={draft.text}
                    readOnly
                    rows={7}
                    aria-label="Your message"
                  />
                  <Box className="help-draft-actions">
                    <a
                      className="help-contact-submit"
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Telegram
                    </a>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={async () => {
                        const copied = await copyToClipboard(draft.text);
                        setDraft({ ...draft, copied });
                      }}
                    >
                      Copy again
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={writeAnother}
                    >
                      Write another
                    </button>
                  </Box>
                </Box>
              ) : (
                <form className="help-contact-form" onSubmit={handleContactSubmit}>
                  <Box className="help-field">
                    <label htmlFor="help-name">Your name</label>
                    <input
                      id="help-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Type your name here"
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
                    <label htmlFor="help-reply">Your email or Telegram</label>
                    <input
                      id="help-reply"
                      type="text"
                      name="reply"
                      placeholder="you@example.com or @your_telegram"
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
                        So we know where to answer you.
                      </p>
                    )}
                  </Box>
                  <Box className="help-field">
                    <label htmlFor="help-message">Message</label>
                    <textarea
                      id="help-message"
                      name="message"
                      placeholder="Your message"
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
                    Send
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
