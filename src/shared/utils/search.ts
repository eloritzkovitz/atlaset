/**
 * Utility functions for search operations.
 */

/**
 * Finds the index where trailing explicit modifiers begin in a token list.
 * @param tokens - The list of tokens to analyze.
 * @param modifierRegex - A regex to identify modifier tokens, defaulting to "key:value" format.
 * @returns The index in the tokens array where modifiers start, or tokens.length if no modifiers are found.
 */
export function identifyModifierRange(
  tokens: string[],
  modifierRegex: RegExp = /^([a-zA-Z_]+):(.+)$/,
) {
  let modifierStart = tokens.length;
  for (let i = tokens.length - 1; i >= 0; i--) {
    const tk = tokens[i];
    if (!modifierRegex.test(tk)) break;
    modifierStart = i;
  }
  return modifierStart;
}

/**
 * Coerce a raw modifier value into boolean or keep as string.
 * @param rawVal - The raw string value of the modifier to coerce.
 * @returns The coerced boolean value if it matches common true/false representations, or the original string if not.
 */
export function coerceModifierValue(rawVal: string): boolean | string {
  const low = rawVal.toLowerCase();
  if (low === "true" || low === "yes") return true;
  if (low === "false" || low === "no") return false;
  return rawVal;
}

/**
 * Parses modifiers from tokens starting at `startIndex` using `modifierRegex`.
 * @param tokens - The list of tokens to analyze.
 * @param startIndex - The index at which to start parsing modifiers.
 * @param modifierRegex - A regex to identify modifier tokens, defaulting to "key:value" format.
 * @returns An object containing the parsed modifier keys and values.
 */
export function parseModifiers(
  tokens: string[],
  startIndex: number,
  modifierRegex: RegExp = /^([a-zA-Z_]+):(.+)$/,
): Record<string, boolean | string> {
  const modifiers: Record<string, boolean | string> = {};
  for (let i = startIndex; i < tokens.length; i++) {
    const tk = tokens[i];
    const mm = tk.match(modifierRegex);
    if (!mm) continue;
    const key = mm[1].toLowerCase();
    modifiers[key] = coerceModifierValue(mm[2]);
  }
  return modifiers;
}

/**
 * Parses a search string for qualifier-based searching.
 * @param input - The search string input by the user.
 * @returns An object containing the qualifier and query if the input matches the expected format, otherwise null.
 */
export function parseQualifierSearch(input: string) {
  const raw = input?.trim() ?? "";
  if (!raw) return null;

  const tokens = raw.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;

  const first = tokens[0];
  const m = first.match(/^([a-zA-Z_]+):\s*(.*)$/);
  if (!m) return null;

  // Extract the qualifier and the query, and handle any modifiers in the query
  const qualifier = m[1].toLowerCase();
  const restRaw = m[2] ?? "";
  const restTokens = restRaw.length > 0 ? restRaw.split(/\s+/) : [];
  if (tokens.length > 1) restTokens.push(...tokens.slice(1));

  const modifierRegex = /^([a-zA-Z_]+):(.+)$/;
  const modifierStart = identifyModifierRange(restTokens, modifierRegex);
  const modifiers = parseModifiers(restTokens, modifierStart, modifierRegex);

  const queryTokens = restTokens.slice(0, modifierStart);
  const query = queryTokens.join(" ");

  return { qualifier, query, modifiers };
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
  const m = input.match(/^([a-zA-Z_]*)$/);
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
 * Default behavior for selecting an autocomplete suggestion.
 * Replaces the current input with "suggestion: restOfInput".
 * @param suggestion - The selected suggestion to insert.
 * @param input - The current input value before selection.
 * @returns A new string combining the suggestion and the rest of the input after the colon.
 */
export function defaultOnSelect(suggestion: string, input: string) {
  const m = input.match(/^([a-zA-Z_]*):?(.*)$/);
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
