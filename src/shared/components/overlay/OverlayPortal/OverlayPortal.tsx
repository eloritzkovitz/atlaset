import type { ReactNode } from "react";
import ReactDOM from "react-dom";

interface OverlayPortalProps {
  children: ReactNode;
}

/** A portal for rendering overlay content outside of the main DOM hierarchy. */
export function OverlayPortal({ children }: OverlayPortalProps) {
  return ReactDOM.createPortal(children, document.body);
}
