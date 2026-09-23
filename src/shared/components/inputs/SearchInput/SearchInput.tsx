import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type UIEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useKeyHandler } from "@hooks";

interface SearchInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onClick?: (e: MouseEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showClear?: boolean;
  onClear?: () => void;
  showIcon?: boolean;
  className?: string;
  style?: CSSProperties;
  overlayContent?: ReactNode;
}

/** Renders a search input with optional icon and clear button. */
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
    const { t } = useTranslation("common");

    const generatedId = useId();
    const inputId = id || generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const isMousedown = useRef(false);

    const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);
    const [scrollLeft, setScrollLeft] = useState(0);

    const overlayStart = showIcon ? 40 : 12;
    const overlayEnd = showClear ? 44 : 12;

    const clearLabel = `${t("components.search.clear", "Clear")} ${t(
      "components.search.placeholder",
      "Search",
    )}`;

    const setInputRef = (element: HTMLInputElement | null) => {
      inputRef.current = element;

      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    useKeyHandler(
      (e) => {
        e.preventDefault();
        setIsKeyboardFocused(true);
        inputRef.current?.focus();
      },
      ["/"],
      { allowSingleKeyShortcuts: true },
    );

    useKeyHandler(
      (e) => {
        if (document.activeElement === inputRef.current) {
          e.preventDefault();
          inputRef.current?.blur();
        }
      },
      ["Escape"],
    );

    // Update scrollLeft when value or overlayContent changes
    useLayoutEffect(() => {
      setScrollLeft(inputRef.current?.scrollLeft ?? 0);
    }, [value, overlayContent]);

    return (
      <div
        className={`relative w-full rounded-full transition-shadow ${
          isKeyboardFocused ? "ring-2 ring-ring-focus" : ""
        }`}
      >
        {overlayContent && (
          <div
            className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 overflow-hidden"
              style={{ left: overlayStart, right: overlayEnd }}
            >
              <div
                className="absolute inset-y-0 flex items-center whitespace-pre"
                style={{
                  minWidth: "max-content",
                  transform: `translateX(-${scrollLeft}px)`,
                }}
              >
                {overlayContent}
              </div>
            </div>
          </div>
        )}

        {showIcon && (
          <ICONS.search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-muted z-20" />
        )}

        <input
          ref={setInputRef}
          id={inputId}
          name={name || "search"}
          type="text"
          role="searchbox"
          autoComplete="off"
          autoCorrect="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e: UIEvent<HTMLInputElement>) =>
            setScrollLeft(e.currentTarget.scrollLeft)
          }
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
            onClick?.(e);
            isMousedown.current = false;
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);

            if (e.key === "Escape") {
              e.preventDefault();
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          aria-label={
            placeholder || t("components.search.placeholder", "Search")
          }
          className={`w-full ${
            showIcon ? "ps-10" : "ps-3"
          } pe-10 py-2 bg-input rounded-full border border-none text-base outline-none focus:outline-none focus:ring-0 ${className}`}
          style={{
            ...style,
            ...(overlayContent
              ? {
                  color: "transparent",
                  caretColor: "var(--color-text)",
                }
              : {}),
            paddingRight: showClear ? 44 : undefined,
            zIndex: 20,
          }}
        />

        {showClear && value && (
          <button
            type="button"
            aria-label={clearLabel}
            title={clearLabel}
            onClick={() => onClear?.() ?? onChange("")}
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
