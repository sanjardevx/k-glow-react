import type { AuthMode } from "../auth";
import { NavbarContent } from "./NavbarContent";

interface HomeNavbarProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/** Header for "/". Same content as OtherNavbar today; see NavbarContent. */
export function HomeNavbar({ onAuthOpen }: HomeNavbarProps) {
  return <NavbarContent onAuthOpen={onAuthOpen} />;
}
