import { useState, type ReactNode } from "react";
import { GlobalContext } from "./useGlobals";
import { getAccessToken } from "../../lib/authToken";
import type { Member } from "../../lib/types/member";

/**
 * Holds who is signed in, for the whole app.
 *
 * The member is read back from localStorage on boot so a reload doesn't log
 * anyone out — but the token is the real session, and the saved member is only
 * a copy of who it belongs to. Without a token that copy is stale, so it gets
 * dropped; otherwise the navbar would show a signed-in visitor whose every
 * request the server rejects.
 *
 * This used to look for an `accessToken` cookie instead, which on the deployed
 * site never existed: the API is on another domain, so its cookie is invisible
 * to document.cookie here even when the browser still holds it. Every reload
 * therefore wiped the signed-in member. Checking the stored token is both
 * correct and readable from this origin.
 */
export function ContextProvider({ children }: { children: ReactNode }) {
  const [authMember, setAuthMember] = useState<Member | null>(() => {
    if (!getAccessToken()) {
      localStorage.removeItem("memberData");
      return null;
    }

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
