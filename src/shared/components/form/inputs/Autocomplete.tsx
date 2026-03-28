import { useRef, useState, type KeyboardEvent } from "react";
import { useAutocomplete, useTextWidth } from "@hooks";
import { computeSuffix } from "@utils/search";
import { PrefixHint } from "./PrefixHint";
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
  const {
    topSuggestion,
    propCandidate,
    afterColon,
    hasColon,
    handleKeyDown,
    isPrefixValid,
    commitWithPrefix,
    clearQualifier,
  } = useAutocomplete({
    value,
    onChange,
    suggestionProvider,
    onSelect: onSelect,
    postSelect: () => inputRef.current?.blur(),
    maxSuggestions,
    debounceMs: 60,
  });

  // Determine if the current input has a valid prefix and compute the display value accordingly
  const isValidPrefix = isPrefixValid ?? false;
  const displayValue = hasColon ? (isValidPrefix ? afterColon : value) : value;

  // Measure the width of the typed text to position the inline suggestion hint correctly
  const { measurerRef, suffixLeft } = useTextWidth(displayValue, inputRef);
  const [prefixWidth, setPrefixWidth] = useState(0);

  return (
    <div className={`relative ${className}`}>
      {/* invisible measurer for computing typed text width */}
      <span
        ref={measurerRef}
        className="absolute invisible whitespace-pre text-base"
        aria-hidden
      />
      <PrefixHint
        topSuggestion={topSuggestion}
        propCandidate={propCandidate}
        isValid={isValidPrefix}
        left={INPUT_ICON_OFFSET}
        onWidthChange={setPrefixWidth}
      />
      <SearchInput
        ref={inputRef}
        value={displayValue}
        onChange={(v) => {
          // If user clears the input entirely, clear everything
          if (v === "") {
            if (hasColon && isValidPrefix) {
              commitWithPrefix("");
            } else {
              clearQualifier();
            }
            return;
          }

          // If user has typed a qualifier token and is now changing the value, only recombine when the prefix is valid
          if (hasColon && isValidPrefix) {
            commitWithPrefix(v);
            return;
          }

          // Otherwise pass the raw input through
          onChange(v);
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          handleKeyDown(e);
        }}
        placeholder={hasColon ? undefined : placeholder}
        className={className}
        showClear={hasColon || Boolean(displayValue)}
        onClear={() => onChange("")}
        style={
          hasColon && isValidPrefix
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
