import axios from "axios";
import { serverApi } from "../../lib/config";
import type {
  AiStatus,
  ChatAnswer,
  ChatMessage,
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
}

export default AiService;
