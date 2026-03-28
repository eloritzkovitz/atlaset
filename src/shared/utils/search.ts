/**
 * Utility functions for search operations.
 */

/**
 * Parses an input string into parts for property-based search.
 * @param value - The input string to parse, expected in the format "qualifier:query".
 * @returns An object containing the property candidate, the query after the colon, and a boolean indicating if a colon is present.
 */
export function parsePropertyParts(value: string) {
  const parts = value.match(/^([a-zA-Z_]*):?([\s\S]*)$/) || ["", "", ""];
  return {
    propCandidate: parts[1] || "",
    afterColon: parts[2] || "",
    hasColon: value.includes(":"),
  };
}

/**
 * Compute the inline muted suffix to display when typing a property prefix.
 * Returns the suffix (e.g. "code:") or null when there is no suffix.
 */
export function computeSuffix(
  topSuggestion?: string | undefined,
  propCandidate?: string,
) {
  if (!topSuggestion || !propCandidate) return null;
  const rem = topSuggestion.slice(propCandidate.length);
  if (!rem) return null;
  return rem + ":";
}

/**
 * Combine a prefix and the text after the colon into a committed value.
 * This mirrors the component behavior when the input contains a property token.
 * @param prefix - The property prefix to combine.
 * @param after - The text to go after the colon.
 * @returns A combined string in the format "prefix:after".
 */
export function formatCommittedValue(prefix: string, after: string) {
  return `${prefix}:${after}`;
}

/**
 * Check whether a prefix matches an available suggestion (case-insensitive exact match).
 * @param prefix - The typed prefix to validate.
 * @param suggestions - The list of available suggestions to check against.
 * @return True if the prefix is a valid suggestion, false otherwise.
 */
export function isValidQualifier(prefix: string, suggestions: string[]) {
  if (!prefix) return false;
  const p = prefix.toLowerCase();
  return suggestions.some((s) => s.toLowerCase() === p);
}

/**
 * Default behavior for selecting an autocomplete suggestion.
 * Replaces the current input with "suggestion: restOfInput".
 * @param suggestion - The selected suggestion to insert.
 * @param input - The current input value before selection.
 * @returns A new string combining the suggestion and the rest of the input after the colon.
 */
export function defaultOnSelect(suggestion: string, input: string) {
  const m = input.match(/^([a-zA-Z_]*):?(.*)$/);
  const rest = m ? m[2] : "";
  return `${suggestion}:${rest.trimStart()}`;
}
