import axios from "axios";
import { serverApi } from "../../lib/config";
import type { LoginInput, Member, MemberInput } from "../../lib/types/member";

class MemberService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const url = this.path + "/member/signup";
      // withCredentials so the accessToken cookie the server sets is stored
      // and sent back on later requests.
      const result = await axios.post(url, input, { withCredentials: true });

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("Error, signup:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const url = this.path + "/member/login";
      const result = await axios.post(url, input, { withCredentials: true });

      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));

      return member;
    } catch (err) {
      console.log("Error, login:", err);
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
      localStorage.removeItem("memberData");
    }
  }
}

export default MemberService;
