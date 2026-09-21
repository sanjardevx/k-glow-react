import { createContext, useContext } from "react";
import type { Member } from "../../lib/types/member";
import type { ActiveDiscount } from "../../lib/types/discount";

interface GlobalInterface {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  /**
   * The sale the server says is running. Read once on boot and shared, so the
   * banner, the basket and the payment modal can never quote three different
   * numbers — and so a sale switched off in the admin panel stops being
   * advertised on the next page load.
   */
  activeDiscount: ActiveDiscount;
}

export const GlobalContext = createContext<GlobalInterface | undefined>(
  undefined,
);

export const useGlobals = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobals must be used inside ContextProvider");
  }

  return context;
};
