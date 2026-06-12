import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa6";
import { mapLanguages, useLanguage } from "@features/settings";
import { useClickOutside } from "@hooks";
import { LanguageMenuList } from "./LanguageMenuList";

export function LanguageSelect() {
  const { t } = useTranslation("common");
  const { current, change } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the menu
  useClickOutside(
    [containerRef as React.RefObject<HTMLElement>],
    () => setIsOpen(false),
    isOpen,
  );

  const languages = mapLanguages(t);
  const currentLanguage = languages.find((l) => l.code === current);

  // Handle language selection
  const handleSelect = (code: string) => {
    if (code !== current) change(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 py-1 px-3 text-sm font-semibold !text-muted hover:text-muted/80 rounded transition-colors"
      >
        <span>{currentLanguage?.native || current.toUpperCase()}</span>
        <span
          className={`inline-flex transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <FaChevronDown className="text-xs" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/4 -translate-x-1/2 mb-2 p-1 w-30 overflow-y-auto rounded-md bg-surface shadow-lg z-50">
          <LanguageMenuList languages={languages} onSelect={handleSelect} />
        </div>
      )}
    </div>
  );
}
