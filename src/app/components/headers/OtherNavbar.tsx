import type { AuthMode } from "../auth";
import { NavbarContent } from "./NavbarContent";

interface OtherNavbarProps {
  onAuthOpen: (mode: AuthMode) => void;
}

/** Header for every route except "/". See NavbarContent. */
export function OtherNavbar({ onAuthOpen }: OtherNavbarProps) {
  return <NavbarContent onAuthOpen={onAuthOpen} />;
}
