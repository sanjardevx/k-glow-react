import { useState, type ReactNode } from "react";
import Cookies from "universal-cookie";
import { GlobalContext } from "./useGlobals";
import type { Member } from "../../lib/types/member";

/**
 * Holds who is signed in, for the whole app.
 *
 * The member is read back from localStorage on boot so a reload doesn't log
 * anyone out — but the cookie is the real session. If it has expired while the
 * tab was closed, the saved member is stale and gets dropped, otherwise the
 * navbar would show a signed-in user whose requests the server rejects.
 */
export function ContextProvider({ children }: { children: ReactNode }) {
  const cookies = new Cookies();
  if (!cookies.get("accessToken")) localStorage.removeItem("memberData");

  const [authMember, setAuthMember] = useState<Member | null>(() => {
    const saved = localStorage.getItem("memberData");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  return (
    <GlobalContext.Provider value={{ authMember, setAuthMember }}>
      {children}
    </GlobalContext.Provider>
  );
}
