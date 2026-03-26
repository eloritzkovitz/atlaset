import { useCallback, useMemo } from "react";
import { parsePropertyParts, defaultOnSelect } from "@utils/search";
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

/**
 * Manages autocomplete functionality.
 * @param value The current input value.
 * @param onChange Callback to update the input value.
 * @param suggestionProvider Function that returns suggestions based on the input.
 * @param onSelect Optional callback to customize what happens when a suggestion is selected.
 * @param postSelect Optional callback that runs after a suggestion is selected (e.g., to blur the input).
 * @param maxSuggestions Maximum number of suggestions to return (default: 6).
 * @param debounceMs Debounce delay in milliseconds for updating suggestions (default: 60).
 * @returns An object containing the current suggestions, a keydown handler for the input, and a function to pick a suggestion.
 */
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
  // Parse the live value into property parts for consumers
  const parsedParts = parsePropertyParts(value);

  const suggestions = useMemo(() => {
    if (!debouncedValue || debouncedValue.trim() === "") return [];

    // If the input is just a colon, treat it as empty to avoid showing all suggestions
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

  // Default onSelect behavior if not provided: replace the input with "suggestion: restOfInput"
  const defaultOnSelectCb = useCallback(defaultOnSelect, []);

  // Handles picking a suggestion, which calls the onSelect callback and then the postSelect callback if provided
  const pickSuggestion = useCallback(
    (s: string) => {
      const res = onSelect ? onSelect(s, value) : defaultOnSelectCb(s, value);
      if (typeof res === "string") onChange(res);
      if (typeof postSelect === "function") postSelect();
    },
    [onChange, onSelect, value, defaultOnSelect, postSelect],
  );

  // Handles keydown events for the input, specifically looking for the Enter key to select the top suggestion
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions || suggestions.length === 0) return;
      if (e.key === "Enter") {
        const m = value.match(/^([a-zA-Z_]*)$/);

        if (m && m[1].length >= 2 && suggestions.length > 0) {
          const first = suggestions[0];
          if (first.toLowerCase().startsWith(m[1].toLowerCase())) {
            e.preventDefault();
            pickSuggestion(first);
          }
        }
      }
    },
    [suggestions, value, pickSuggestion],
  );

  return {
    suggestions,
    topSuggestion:
      suggestions && suggestions.length > 0 ? suggestions[0] : undefined,
    propCandidate: parsedParts.propCandidate,
    afterColon: parsedParts.afterColon,
    hasColon: parsedParts.hasColon,
    handleKeyDown,
    pickSuggestion,
    debouncedValue,
  } as const;
}
