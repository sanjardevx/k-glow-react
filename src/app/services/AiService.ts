import axios from "axios";
import { serverApi } from "../../lib/config";
import { getAccessToken } from "../../lib/authToken";
import type {
  AiStatus,
  ChatAnswer,
  ChatMessage,
  ChatStreamEvent,
  Routine,
  RoutineRequest,
} from "../../lib/types/routine";

/**
 * AI Beauty, members only: the axios interceptor in main.tsx adds the
 * session, and the server counts every answer against a daily limit.
 */
class AiService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /** Answers left today, and the saved routine if there is one. */
  public async getStatus(): Promise<AiStatus> {
    const result = await axios.get(`${this.path}/ai/status`);
    return result.data;
  }

  /** The skin quiz in, a routine of in-stock products out. */
  public async buildRoutine(input: RoutineRequest): Promise<Routine> {
    try {
      const result = await axios.post(`${this.path}/ai/routine`, input);
      return result.data;
    } catch (err) {
      console.log("Error, buildRoutine:", err);
      throw err;
    }
  }

  /** The conversation so far (ending with the new question) in, a short
   *  answer and product cards out. */
  public async chat(
    messages: ChatMessage[],
    lang: RoutineRequest["lang"],
  ): Promise<ChatAnswer> {
    try {
      const result = await axios.post(`${this.path}/ai/chat`, {
        messages: messages.map(({ role, content }) => ({ role, content })),
        lang,
      });
      return result.data;
    } catch (err) {
      console.log("Error, chat:", err);
      throw err;
    }
  }

  /**
   * The same chat, with the reply shown as it is written. The server sends
   * one JSON event per line; `onEvent` gets each one, and the finished
   * answer is returned at the end. Errors are thrown in axios's shape, so
   * the usual error handling and messages work unchanged.
   *
   * fetch rather than axios, because axios can't read a response while it
   * is still arriving in the browser.
   */
  public async chatStream(
    messages: ChatMessage[],
    lang: RoutineRequest["lang"],
    onEvent: (event: ChatStreamEvent) => void,
  ): Promise<ChatAnswer> {
    const token = getAccessToken();
    const res = await fetch(`${this.path}/ai/chat/stream`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        messages: messages.map(({ role, content }) => ({ role, content })),
        lang,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw { response: { status: res.status, data } };
    }

    let answer: ChatAnswer | null = null;
    const handle = (line: string) => {
      if (!line.trim()) return;
      const event = JSON.parse(line);
      if (event.type === "done") {
        const { type: _type, ...rest } = event;
        answer = rest as ChatAnswer;
      } else if (event.type === "error") {
        throw { response: { status: 500, data: { message: event.message } } };
      } else {
        onEvent(event as ChatStreamEvent);
      }
    };

    if (res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        lines.forEach(handle);
        if (done) break;
      }
      handle(buffer);
    } else {
      // No streaming in this browser: read it all at once.
      (await res.text()).split("\n").forEach(handle);
    }

    if (!answer) throw new Error("The answer was cut off.");
    return answer;
  }
}

export default AiService;
