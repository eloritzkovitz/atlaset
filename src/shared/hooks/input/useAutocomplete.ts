import { useCallback, useMemo } from "react";
import {
  parsePropertyParts,
  defaultOnSelect,
  isValidQualifier,
  formatCommittedValue,
} from "@utils/search";
import { useDebounce } from "../state/useDebounce";

interface UseAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  suggestionProvider: (input: string) => string[];
  onSelect?: (suggestion: string, input: string) => string | void;
  postSelect?: () => void;
  maxSuggestions?: number;
  debounceMs?: number;
}

export function useAutocomplete({
  value,
  onChange,
  suggestionProvider,
  onSelect,
  postSelect,
  maxSuggestions = 6,
  debounceMs = 60,
}: UseAutocompleteProps) {
  const debouncedValue = useDebounce(value, debounceMs);
  const parsedParts = parsePropertyParts(value);

  // Compute suggestions based on the debounced input value and the provided suggestion provider
  const suggestions = useMemo(() => {
    if (!debouncedValue || debouncedValue.trim() === "") return [];

    const parts = parsePropertyParts(debouncedValue);
    const suggestionSeed = parts.propCandidate || debouncedValue;
    const s = suggestionProvider(suggestionSeed) || [];

    const prefixMatch = (suggestionSeed || "").match(/^([a-zA-Z_]*)$/);
    if (prefixMatch && prefixMatch[1].length > 0) {
      const p = prefixMatch[1].toLowerCase();
      return s
        .filter((opt) => opt.toLowerCase().startsWith(p))
        .slice(0, maxSuggestions);
    }
    return s.slice(0, maxSuggestions);
  }, [debouncedValue, suggestionProvider, maxSuggestions]);

  // Determine if the current input has a valid prefix for showing the inline suggestion hint
  const isPrefixValid = useMemo(() => {
    const candidate = parsedParts.propCandidate || "";
    return isValidQualifier(candidate, suggestions);
  }, [parsedParts.propCandidate, suggestions]);

  const defaultOnSelectCb = useCallback(defaultOnSelect, []);

  // Handle selection of a suggestion, either using the provided onSelect callback or the default behavior
  const pickSuggestion = useCallback(
    (s: string) => {
      const res = onSelect ? onSelect(s, value) : defaultOnSelectCb(s, value);
      if (typeof res === "string") onChange(res);
      if (typeof postSelect === "function") postSelect();
    },
    [onChange, onSelect, value, defaultOnSelectCb, postSelect],
  );

  // Clear the qualifier prefix when backspacing on an empty after-colon input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Enter: pick suggestion when typing a prefix
      if (e.key === "Enter") {
        if (suggestions && suggestions.length > 0) {
          const m = value.match(/^([a-zA-Z_]*)$/);
          if (m && m[1].length >= 2) {
            const first = suggestions[0];
            if (first.toLowerCase().startsWith(m[1].toLowerCase())) {
              e.preventDefault();
              pickSuggestion(first);
              return;
            }
          }
        }
      }

      // Backspace: if there's a colon and nothing after it, clear entire input
      const parts = parsePropertyParts(value);
      if (
        e.key === "Backspace" &&
        parts.hasColon &&
        (parts.afterColon || "") === ""
      ) {
        e.preventDefault();
        onChange("");
        return;
      }
    },
    [suggestions, value, pickSuggestion, onChange],
  );

  // Commit the current input with the selected prefix, if valid, when picking a suggestion
  const commitWithPrefix = useCallback(
    (after: string) => {
      const prefix = parsedParts.propCandidate || "";
      if (isValidQualifier(prefix, suggestions)) {
        onChange(formatCommittedValue(prefix, after));
      } else {
        onChange(after);
      }
    },
    [parsedParts.propCandidate, suggestions, onChange],
  );

  const clearQualifier = useCallback(() => onChange(""), [onChange]);

  return {
    suggestions,
    topSuggestion:
      suggestions && suggestions.length > 0 ? suggestions[0] : undefined,
    propCandidate: parsedParts.propCandidate,
    afterColon: parsedParts.afterColon,
    hasColon: parsedParts.hasColon,
    isPrefixValid,
    handleKeyDown,
    pickSuggestion,
    commitWithPrefix,
    clearQualifier,
    debouncedValue,
  } as const;
}
