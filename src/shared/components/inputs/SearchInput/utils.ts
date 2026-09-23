/**
 * Utility functions for the QualifierSearch component.
 */

/** Represents a token in the search input, which can be text, a qualifier or a modifier. */
export interface SearchToken {
  text: string;
  type: "text" | "qualifier" | "modifier";
}

/** Escapes special regex characters. */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
}

/** Builds a search regex from the provided qualifiers and modifiers. */
export function buildSearchRegex(
  qualifierAlternatives: string | null,
  modifierAlternatives: string | null,
): RegExp {
  if (qualifierAlternatives && modifierAlternatives) {
    return new RegExp(
      `\\b(${qualifierAlternatives})\\s*:|\\b(${modifierAlternatives})\\s*:`,
      "gi",
    );
  }

  if (qualifierAlternatives) {
    return new RegExp(`\\b(${qualifierAlternatives})\\s*:`, "gi");
  }

  if (modifierAlternatives) {
    return new RegExp(`\\b(${modifierAlternatives})\\s*:`, "gi");
  }

  return /\b[A-Za-z0-9_-]+\s*:/gi;
}

/** Builds tokens used by the syntax-highlighting overlay. */
export function tokenizeSearch(
  text: string,
  regex: RegExp,
  hasQualifiers: boolean,
  hasModifiers: boolean,
): SearchToken[] {
  if (!text) {
    return [];
  }

  const tokens: SearchToken[] = [];
  let lastIndex = 0;

  regex.lastIndex = 0;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: text.slice(lastIndex, match.index),
        type: "text",
      });
    }

    let type: SearchToken["type"] = "qualifier";

    if (hasQualifiers && hasModifiers) {
      type = match[1] ? "qualifier" : "modifier";
    } else if (hasModifiers && !hasQualifiers) {
      type = "modifier";
    }

    tokens.push({
      text: match[0],
      type,
    });

    lastIndex = regex.lastIndex;

    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }

  if (lastIndex < text.length) {
    tokens.push({
      text: text.slice(lastIndex),
      type: "text",
    });
  }

  return tokens;
}
