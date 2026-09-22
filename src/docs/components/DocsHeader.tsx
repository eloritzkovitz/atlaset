import { Link } from "react-router-dom";
import { Branding } from "@components";
import { DocSearchDropdown } from "./DocSearchDropdown";
import { DocsLanguageSelector } from "./DocsLanguageSelector";

interface DocsHeaderProps {
  show: boolean;
}

/** Renders the documentation header. */
export function DocsHeader({ show }: DocsHeaderProps) {
  if (!show) return null;

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex shrink-0 items-center">
        <Branding size={36} />

        <Link
          to="/docs"
          className="rounded-md px-1 py-1 text-2xl font-bold transition-colors hover:text-info focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus"
          aria-label="Atlaset Docs"
        >
          Atlaset Docs
        </Link>
      </div>

      <div className="end-0 flex items-center gap-4">
        <DocSearchDropdown className="w-96" />

        <DocsLanguageSelector
          value="en"
          onChange={(language) => {
            console.log("Docs language changed:", language);
          }}
        />
      </div>
    </header>
  );
}
