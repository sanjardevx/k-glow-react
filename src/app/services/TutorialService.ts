import axios from "axios";
import { serverApi } from "../../lib/config";
import type { Tutorial } from "../../lib/types/tutorial";

class TutorialService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /** Active tutorials, newest first — hidden ones never leave the server. */
  public async getTutorials(limit: number): Promise<Tutorial[]> {
    try {
      const url = `${this.path}/tutorial/all?page=1&limit=${limit}`;
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      console.log("Error, getTutorials:", err);
      throw err;
    }
  }

  /**
   * Counts a play. The endpoint returns the tutorial, but the caller only
   * wants the side effect — a failed count must never keep the video from
   * playing, so this swallows the error instead of rethrowing.
   */
  public async countView(tutorialId: string): Promise<void> {
    try {
      await axios.get(`${this.path}/tutorial/${tutorialId}`);
    } catch (err) {
      console.log("Error, countView:", err);
    }
  }
}

export default TutorialService;
