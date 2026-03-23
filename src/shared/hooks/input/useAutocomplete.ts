import { useCallback, useMemo } from "react";
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

  const suggestions = useMemo(() => {
    if (!debouncedValue || debouncedValue.trim() === "") return [];
    const s = suggestionProvider(debouncedValue) || [];
    const prefixMatch = (debouncedValue || "").match(/^([a-zA-Z_]*)$/);
    if (prefixMatch && prefixMatch[1].length > 0) {
      const p = prefixMatch[1].toLowerCase();
      return s
        .filter((opt) => opt.toLowerCase().startsWith(p))
        .slice(0, maxSuggestions);
    }
    return s.slice(0, maxSuggestions);
  }, [debouncedValue, suggestionProvider, maxSuggestions]);

  const defaultOnSelect = useCallback((s: string, input: string) => {
    const m = input.match(/^([a-zA-Z_]*):?(.*)$/);
    const rest = m ? m[2] : "";
    return `${s}:${rest.trimStart()}`;
  }, []);

  const pickSuggestion = useCallback(
    (s: string) => {
      const res = onSelect ? onSelect(s, value) : defaultOnSelect(s, value);
      if (typeof res === "string") onChange(res);
      if (typeof postSelect === "function") postSelect();
    },
    [onChange, onSelect, value, defaultOnSelect, postSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions || suggestions.length === 0) return;
      if (e.key === "Enter") {
        const m = value.match(/^([a-zA-Z_]*)$/);
        if (m && m[1].length > 0 && suggestions.length > 0) {
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
    handleKeyDown,
    pickSuggestion,
    debouncedValue,
  } as const;
}
