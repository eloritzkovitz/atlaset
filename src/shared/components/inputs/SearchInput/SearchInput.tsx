import { useRef, useState, forwardRef, useId } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useKeyHandler } from "@hooks";

interface SearchInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showClear?: boolean;
  onClear?: () => void;
  showIcon?: boolean;
  className?: string;
  style?: React.CSSProperties;
  overlayContent?: React.ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      onClick,
      onKeyDown,
      placeholder,
      showClear = true,
      onClear,
      showIcon = true,
      className = "",
      style,
      overlayContent,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
    const isMousedown = useRef(false);

    // Focus search input when / is pressed
    useKeyHandler(
      (e) => {
        e.preventDefault();
        setIsKeyboardFocused(true);
        if (typeof ref === "function") {
          inputRef.current?.focus();
        } else if (ref && "current" in ref && ref.current) {
          ref.current.focus();
        } else {
          inputRef.current?.focus();
        }
      },
      ["/"],
    );

    // Blur search input when Escape is pressed
    useKeyHandler(
      (e) => {
        const active =
          typeof ref === "function"
            ? inputRef.current
            : ref && "current" in ref
              ? ref.current
              : inputRef.current;
        if (document.activeElement === active) {
          e.preventDefault();
          active?.blur();
        }
      },
      ["Escape"],
    );

    const { t } = useTranslation("common");

    return (
      <div
        className={`relative w-full rounded-full transition-shadow ${
          isKeyboardFocused ? "ring-2 ring-ring-focus" : ""
        }`}
      >
        {overlayContent && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div
              ref={overlayRef}
              className={`w-full text-base whitespace-pre flex items-center ${
                showIcon === false ? "ps-3" : "ps-10"
              } pe-10 py-2`}
              style={{
                paddingRight: showClear ? 44 : undefined,
                overflow: "hidden",
              }}
            >
              <div
                className="w-full"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "clip",
                }}
              >
                <div style={{ display: "inline-block" }}>{overlayContent}</div>
              </div>
            </div>
          </div>
        )}
        {showIcon !== false && (
          <ICONS.search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-muted z-20" />
        )}
        <input
          ref={ref || inputRef}
          id={inputId}
          name={name || "search"}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            if (overlayRef.current)
              overlayRef.current.scrollLeft = (
                e.target as HTMLInputElement
              ).scrollLeft;
          }}
          onMouseDown={() => {
            isMousedown.current = true;
          }}
          onFocus={() => {
            if (!isMousedown.current) {
              setIsKeyboardFocused(true);
            }
          }}
          onBlur={() => {
            setIsKeyboardFocused(false);
            isMousedown.current = false;
          }}
          onClick={(e) => {
            if (onClick) onClick(e);
            isMousedown.current = false;
          }}
          onKeyDown={(e) => {
            if (onKeyDown) {
              onKeyDown(e);
            }
            if (e.key === "Escape") {
              e.preventDefault();
              const active =
                typeof ref === "function"
                  ? inputRef.current
                  : ref && "current" in ref
                    ? ref.current
                    : inputRef.current;
              active?.blur();
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder || t("search.placeholder", "Search")}
          className={`w-full ${showIcon === false ? "ps-3" : "ps-10"} pe-10 py-2 bg-input rounded-full border border-none text-base outline-none focus:outline-none focus:ring-0 ${className}`}
          style={{
            ...(style || {}),
            ...(overlayContent
              ? { color: "transparent", caretColor: "var(--color-text)" }
              : {}),
            paddingRight: showClear ? 44 : undefined,
            zIndex: 20,
          }}
        />
        {showClear && value.length > 0 && (
          <button
            type="button"
            aria-label={`${t("search.clear", "Clear")} ${t("search.placeholder", "Search")}`}
            title={`${t("search.clear", "Clear")} ${t("search.placeholder", "Search")}`}
            onClick={() => {
              if (onClear) {
                onClear();
                return;
              }
              onChange("");
            }}
            className="absolute end-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-muted-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus rounded-full z-30"
          >
            <ICONS.close />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
