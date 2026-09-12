import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Box, Container, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { ChevronDownIcon } from "../../components/icons";
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

export function HelpPage() {
  const [tab, setTab] = useState("1");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Height is measured from the open answer's real content (same technique
  // as My Page's order accordion) so both the open and close transitions
  // animate the exact distance instead of racing toward a guessed max-height.
  const panelRefs = useRef<Record<number, HTMLParagraphElement | null>>({});
  const [openHeight, setOpenHeight] = useState(0);

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
                Fill out the form below and we'll get back to you.
              </p>
              <form action="#" method="POST" className="help-contact-form">
                <Box className="help-field">
                  <label>Your name</label>
                  <input type="text" name="name" placeholder="Type your name here" />
                </Box>
                <Box className="help-field">
                  <label>Your email or Telegram</label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="you@example.com or @your_telegram"
                  />
                </Box>
                <Box className="help-field">
                  <label>Message</label>
                  <textarea name="message" placeholder="Your message" />
                </Box>
                <button type="submit" className="help-contact-submit">
                  Send
                </button>
              </form>
            </Box>
          </TabPanel>
        </TabContext>
      </Container>
    </div>
  );
}
