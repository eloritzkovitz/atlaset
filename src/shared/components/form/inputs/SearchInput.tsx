import { useRef, useState, forwardRef } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { useKeyboardFocusRing, useKeyHandler } from "@hooks";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  className?: string;
}

// Use forwardRef to allow parent components to pass a ref
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    value,
    onChange,
    onFocus,
    placeholder,
    className = "",
  }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus state and keyboard focus ring
  const [isFocused, setIsFocused] = useState(false);
  const showRing = useKeyboardFocusRing();

    // Focus search input when / is pressed
    useKeyHandler(
      (e) => {
        e.preventDefault();
        // Prefer forwarded ref if present
        if (typeof ref === "function") {
          // Not supported for input refs, but fallback to local ref
          inputRef.current?.focus();
        } else if (ref && "current" in ref && ref.current) {
          ref.current.focus();
        } else {
          inputRef.current?.focus();
        }
      },
      ["/"],
      true
    );

    // Blur search input when Escape is pressed
    useKeyHandler(
      (e) => {
        const active = typeof ref === "function"
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
      true
    );

    return (
      <div
        className={`relative w-full rounded-full transition-shadow ${
          isFocused && showRing ? "ring-2 ring-ring-focus" : ""
        }`}
      >
        <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        <input
          ref={ref || inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (onFocus) onFocus();
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              const active = typeof ref === "function"
                ? inputRef.current
                : ref && "current" in ref
                  ? ref.current
                  : inputRef.current;
              active?.blur();
            }
          }}
          placeholder={placeholder}
          title={placeholder || "Search"}
          aria-label={placeholder || "Search"}
          className={`w-full pl-10 pr-10 py-2 bg-input rounded-full border border-none text-base focus:outline-none ${className}`}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            title="Clear search"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-muted-hover focus:outline-none"
          >
            <FaXmark />
          </button>
        )}
      </div>
    );
  }
);
