import { useRef, useLayoutEffect, useState } from "react";
import { useAutocomplete, useTextWidth } from "@hooks";
import { computeSuffix, formatCommittedValue } from "@utils/search";
import { SearchInput } from "./SearchInput";

const INPUT_ICON_OFFSET = 40;
const MIN_PREFIX_PAD = 32;
const PREFIX_GAP = 8;

interface AutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  suggestionProvider: (input: string) => string[];
  onSelect?: (suggestion: string, input: string) => string | void;
  placeholder?: string;
  maxSuggestions?: number;
  className?: string;
}

export function Autocomplete({
  value,
  onChange,
  suggestionProvider,
  onSelect,
  placeholder,
  maxSuggestions = 6,
  className = "",
}: AutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Manage autocomplete suggestions and selection logic
  const { topSuggestion, propCandidate, afterColon, hasColon, handleKeyDown } =
    useAutocomplete({
      value,
      onChange,
      suggestionProvider,
      onSelect: onSelect,
      postSelect: () => inputRef.current?.blur(),
      maxSuggestions,
      debounceMs: 60,
    });

  // Determine whether to show the inline suggestion hint (only when typing a property token without a colon yet)
  const displayValue = hasColon ? afterColon : value;

  // Measure the width of the typed text to position the inline suggestion hint correctly
  const { measurerRef, suffixLeft } = useTextWidth(displayValue, inputRef);
  const prefixRef = useRef<HTMLDivElement | null>(null);
  const [prefixWidth, setPrefixWidth] = useState(0);

  // Update prefix width when top suggestion, colon presence, or input value changes
  useLayoutEffect(() => {
    const el = prefixRef.current;
    if (el && hasColon) {
      setPrefixWidth(Math.ceil(el.getBoundingClientRect().width));
    } else {
      setPrefixWidth(0);
    }
  }, [topSuggestion, hasColon, value]);

  return (
    <div className={`relative ${className}`}>
      {/* invisible measurer for computing typed text width */}
      <span
        ref={measurerRef}
        className="absolute invisible whitespace-pre text-base"
        aria-hidden
      />

      {hasColon && (topSuggestion || propCandidate) && (
        <div
          ref={prefixRef}
          aria-hidden
          style={{
            position: "absolute",
            left: INPUT_ICON_OFFSET,
            top: "50%",
            transform: "translateY(calc(-50% + 1px))",
            zIndex: 10,
            maxWidth: "160px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          className="pointer-events-none flex items-center text-base text-muted"
        >
          {(topSuggestion || propCandidate) + ":"}
        </div>
      )}
      <SearchInput
        ref={inputRef}
        value={displayValue}
        onChange={(v) => {
          // If input cleared, clear full value
          if (v === "") {
            onChange("");
            return;
          }
          // If user has typed a property token and is now changing the value, preserve the property token and just update the part after the colon
          if (hasColon) {
            const prefix = topSuggestion || propCandidate || "";
            onChange(formatCommittedValue(prefix, v));
            return;
          }
          onChange(v);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        style={
          hasColon
            ? {
                paddingLeft: `${INPUT_ICON_OFFSET + Math.max(prefixWidth, MIN_PREFIX_PAD) + PREFIX_GAP}px`,
              }
            : undefined
        }
      />
      {!hasColon &&
        topSuggestion &&
        propCandidate.length > 0 &&
        (() => {
          const suffix = computeSuffix(topSuggestion, propCandidate);
          if (!suffix) return null;
          return (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${suffixLeft}px`,
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <div className="pl-0 pr-10 py-2 text-muted text-base">
                {suffix}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
