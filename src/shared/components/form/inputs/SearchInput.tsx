import { useRef, useState, forwardRef } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { useKeyboardFocusRing, useKeyHandler } from "@hooks";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
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
      value,
      onChange,
      onFocus,
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
    const inputRef = useRef<HTMLInputElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);

    // Focus state and keyboard focus ring
    const [isFocused, setIsFocused] = useState(false);
    const showRing = useKeyboardFocusRing();

    // Focus search input when / is pressed
    useKeyHandler(
      (e) => {
        e.preventDefault();
        if (typeof ref === "function") {
          inputRef.current?.focus();
        } else if (ref && "current" in ref && ref.current) {
          ref.current.focus();
        } else {
          inputRef.current?.focus();
        }
      },
      ["/"],
      true,
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
      true,
    );

    return (
      <div
        className={`relative w-full rounded-full transition-shadow ${
          isFocused && showRing ? "ring-2 ring-ring-focus" : ""
        }`}
      >
        {overlayContent && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div
              ref={overlayRef}
              className={`w-full text-base whitespace-pre flex items-center ${
                showIcon === false ? "pl-3" : "pl-10"
              } pr-10 py-2`}
            >
              <div className="w-full">{overlayContent}</div>
            </div>
          </div>
        )}
        {showIcon !== false && (
          <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted z-20" />
        )}
        <input
          ref={ref || inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            if (overlayRef.current)
              overlayRef.current.scrollLeft = (
                e.target as HTMLInputElement
              ).scrollLeft;
          }}
          onFocus={() => {
            setIsFocused(true);
            if (onFocus) onFocus();
          }}
          onBlur={() => setIsFocused(false)}
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
          aria-label={placeholder || "Search"}
          className={`w-full ${showIcon === false ? "pl-3" : "pl-10"} pr-10 py-2 bg-input rounded-full border border-none text-base focus:outline-none ${className}`}
          style={{
            ...(style || {}),
            ...(overlayContent
              ? { color: "transparent", caretColor: "var(--color-text)" }
              : {}),
          }}
        />
        {showClear && (
          <button
            type="button"
            aria-label="Clear search"
            title="Clear search"
            onClick={() => {
              if (onClear) {
                onClear();
                return;
              }
              onChange("");
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-muted-hover focus:outline-none"
          >
            <FaXmark />
          </button>
        )}
      </div>
    );
  },
);
