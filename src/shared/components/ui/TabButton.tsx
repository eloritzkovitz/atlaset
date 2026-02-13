import { type ReactNode } from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

/** Renders a tab button component. */
export function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      className={`px-4 py-2 font-bold rounded-t transition-colors ${active ? "text-text !border-b-2 !border-b-text" : "text-muted hover:text-info"}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
