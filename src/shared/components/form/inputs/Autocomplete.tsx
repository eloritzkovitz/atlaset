import { useRef } from "react";
import { useAutocomplete, useTextWidth } from "@hooks";
import { SearchInput } from "./SearchInput";

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
  const { suggestions, handleKeyDown } = useAutocomplete({
    value,
    onChange,
    suggestionProvider,
    onSelect: onSelect,
    postSelect: () => inputRef.current?.blur(),
    maxSuggestions,
    debounceMs: 60,
  });

  // measure typed text width and compute suffix left offset
  const { measurerRef, suffixLeft } = useTextWidth(value, inputRef);

  return (
    <div className={`relative ${className}`}>
      {/* invisible measurer for computing typed text width */}
      <span
        ref={measurerRef}
        className="absolute invisible whitespace-pre text-base"
        aria-hidden
      />
      <SearchInput
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {/* inline muted suggestion suffix */}
      {suggestions.length > 0 &&
        (() => {
          const first = suggestions[0];
          const m = value.match(/^([a-zA-Z_]*)$/);
          if (m && first && first.startsWith(m[1]) && m[1].length > 0) {
            const suffix = first.slice(m[1].length) + ":";
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
          }
          return null;
        })()}
    </div>
  );
}
