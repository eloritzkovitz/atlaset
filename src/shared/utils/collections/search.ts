/**
 * Utility functions for search operations.
 */

/** Normalizes a search text by removing diacritics and converting to lowercase. */
function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Checks if a given token matches a query string based on specified options.
 * @param token - The string token to check against the query.
 * @param query - The search query string to match the token against.
 * @param options - Optional settings for matching behavior, including:
 *  - match: The mode of matching to use (default is "prefix").
 *  - caseSensitive: Whether the match should be case-sensitive (default is false).
 * @returns - True if the token matches the query based on the specified options, false otherwise.
 */
export function matchesToken(
  token: string,
  query: string,
  options?: { match?: string; caseSensitive?: boolean },
) {
  const matchMode = options?.match ?? "prefix";
  const caseSensitive = options?.caseSensitive ?? false;

  const tk = caseSensitive ? token : normalizeSearchText(token);
  const q = caseSensitive ? query : normalizeSearchText(query);

  switch (matchMode) {
    case "prefix":
      return tk.startsWith(q);
    case "substring":
      return tk.includes(q);
    case "exact":
      return tk === q;
    case "regex":
      try {
        const re = new RegExp(query);
        return re.test(token);
      } catch {
        return false;
      }
    default:
      return tk.startsWith(q);
  }
}

/**
 * Parses an input string into parts for property-based search.
 * @param value - The input string to parse, expected in the format "qualifier:query".
 * @returns An object containing the property candidate, the query after the colon, and a boolean indicating if a colon is present.
 */
export function parsePropertyParts(value: string) {
  const parts = value.match(/^([^:]*):?([\s\S]*)$/) || ["", "", ""];
  return {
    propCandidate: parts[1] || "",
    afterColon: parts[2] || "",
    hasColon: value.includes(":"),
  };
}

/**
 * Provides qualifier name suggestions based on user input for qualifier-based searching.
 * @param input - The current input string from the user.
 * @returns An array of suggested qualifier names that match the input prefix.
 */
export function suggestByPrefix(list: string[], input: string) {
  const m = input.match(/^([a-zA-Z0-9_]*)$/);
  if (!m) return [];
  const prefix = m[1].toLowerCase();
  return list.filter((p) => p.toLowerCase().startsWith(prefix));
}

/**
 * Compute the inline muted suffix to display when typing a property prefix.
 * Returns the suffix (e.g. "code:") or null when there is no suffix.
 */
export function computeSuffix(
  topSuggestion?: string | undefined,
  propCandidate?: string,
) {
  if (!topSuggestion) return null;
  if (!propCandidate) return null;

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
 * Default behavior for selecting an autocomplete suggestion.
 * Replaces the current input with "suggestion: restOfInput".
 * @param suggestion - The selected suggestion to insert.
 * @param input - The current input value before selection.
 * @returns A new string combining the suggestion and the rest of the input after the colon.
 */
export function defaultOnSelect(suggestion: string, input: string) {
  const m = input.match(/^([a-zA-Z0-9_]*):?(.*)$/);
  const rest = m ? m[2] : "";
  return `${suggestion}:${rest}`;
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
