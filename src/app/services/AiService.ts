import axios from "axios";
import { serverApi } from "../../lib/config";
import type { Routine, RoutineRequest } from "../../lib/types/routine";

class AiService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  /** The skin quiz in, a routine of in-stock products out (AI Beauty). */
  public async buildRoutine(input: RoutineRequest): Promise<Routine> {
    try {
      const result = await axios.post(`${this.path}/ai/routine`, input);
      return result.data;
    } catch (err) {
      console.log("Error, buildRoutine:", err);
      throw err;
    }
  }
}

export default AiService;
