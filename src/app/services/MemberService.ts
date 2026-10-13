import axios from "axios";
import { serverApi } from "../../lib/config";
import { clearAccessToken, setAccessToken } from "../../lib/authToken";
import type {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "/member/signup";
      // withCredentials lets the server's cookie through as well, which is
      // what a same-origin deployment would use; the stored token below is
      // what actually carries the session across domains.
      const result = await axios.post(url, input, { withCredentials: true });

      const member: Member = result.data.member;
      setAccessToken(result.data.accessToken);
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("Error, signup:", err);
      throw err;
    }
  }

  /** Signs in with the ID token from Google's button — creating the member
   *  on their first visit. */
  public async googleAuth(
    credential: string,
  ): Promise<{ member: Member; isNew: boolean }> {
    try {
      const url = this.path + "/member/google";
      const result = await axios.post(
        url,
        { credential },
        { withCredentials: true },
      );

      const member: Member = result.data.member;
      setAccessToken(result.data.accessToken);
      localStorage.setItem("memberData", JSON.stringify(member));

      return { member, isNew: result.data.isNew };
    } catch (err) {
      console.log("Error, googleAuth:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "/member/login";
      const result = await axios.post(url, input, { withCredentials: true });

      const member: Member = result.data.member;
      setAccessToken(result.data.accessToken);
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("Error, login:", err);
      throw err;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      const formData = new FormData();

      formData.append("memberNick", input.memberNick || "");
      formData.append("memberPhone", input.memberPhone || "");
      formData.append("memberAddress", input.memberAddress || "");
      formData.append("memberDesc", input.memberDesc || "");
      formData.append("memberImage", input.memberImage || "");

      const result = await axios(`${serverApi}/member/update`, {
        method: "POST",
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const member: Member = result.data;
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("Error, updateMember:", err);
      throw err;
    }
  }

  /**
   * Asks the server whether this session is still good. `/member/detail`
   * already requires `verifyAuth` server-side, so it doubles as an
   * "am I still logged in?" probe without a dedicated endpoint.
   *
   * False means the server actually answered "not authenticated". Anything
   * else — the network dropped, the API is cold-starting, a 500 — is rethrown
   * rather than reported as a dead session: signing someone out over a
   * passing blip is far worse than letting a stale session linger until the
   * next check a few seconds later.
   */
  public async checkSession(): Promise<boolean> {
    try {
      await axios.get(`${this.path}/member/detail`, { withCredentials: true });
      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) return false;
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      const url = this.path + "/member/logout";
      await axios.post(url, {}, { withCredentials: true });
    } catch (err) {
      console.log("Error, logout:", err);
      throw err;
    } finally {
      // Drop the local copy either way — if the server call failed because the
      // token was already gone, staying "signed in" here would be worse.
      clearAccessToken();
      localStorage.removeItem("memberData");
    }
  }
}

export default MemberService;
