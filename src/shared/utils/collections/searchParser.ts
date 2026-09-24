import type { ParsedSearchEntry, SearchExpression } from "@types";

interface SearchQueryParser {
  tokens: string[];
  position: number;
}

/**
 * Coerce a raw search value into boolean or keep as string.
 * @param rawVal - The raw string value of the search value to coerce.
 * @returns The coerced boolean value if it matches common true/false representations, or the original string if not.
 */
function coerceSearchValue(rawVal: string): boolean | string {
  const low = rawVal.toLowerCase();
  if (low === "true" || low === "yes") return true;
  if (low === "false" || low === "no") return false;
  return rawVal;
}

/**
 * Tokenizes a search query into values, operators and parentheses. Quoted values may contain whitespace.
 * @param input - The search query string to tokenize.
 * @returns An array of tokens extracted from the input string.
 */
export function tokenizeSearchInput(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;

  const pushCurrent = () => {
    if (!current) return;

    tokens.push(current);
    current = "";
  };

  for (const char of input) {
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
      continue;
    }

    if (!inQuotes && (char === "(" || char === ")")) {
      pushCurrent();
      tokens.push(char);
      continue;
    }

    if (/\s/.test(char) && !inQuotes) {
      pushCurrent();
      continue;
    }

    current += char;
  }

  if (inQuotes) return [];

  pushCurrent();

  return tokens;
}

/**
 * Removes surrounding quotes from a search value. Quoted values group multi-word values into one query value.
 * @param value - The search value to unquote.
 * @returns The unquoted search value.
 */
export function unquoteSearchValue(value: string): string {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }

  return value;
}

/**
 * Parses a search query string into a structured SearchExpression.
 * @param input - The search query string to parse.
 * @returns A SearchExpression representing the parsed query, or null if the input is invalid.
 */
export function parseSearchQuery(input: string): SearchExpression | null {
  if (!input?.trim()) return null;

  const tokens = tokenizeSearchInput(input.trim());

  if (tokens.length === 0) return null;

  const parser: SearchQueryParser = {
    tokens,
    position: 0,
  };

  const expression = parseOrExpression(parser);

  if (!expression || parser.position !== parser.tokens.length) {
    return null;
  }

  return expression;
}

/** Parses OR expressions. */
function parseOrExpression(parser: SearchQueryParser): SearchExpression | null {
  let expression = parseAndExpression(parser);

  while (isOperator(parser, "OR")) {
    parser.position++;

    const right = parseAndExpression(parser);

    if (!expression || !right) return null;

    expression = {
      type: "or",
      left: expression,
      right,
    };
  }

  return expression;
}

/** Parses AND expressions. */
function parseAndExpression(
  parser: SearchQueryParser,
): SearchExpression | null {
  let expression = parseNotExpression(parser);

  while (true) {
    if (isOperator(parser, "AND")) {
      parser.position++;

      const right = parseNotExpression(parser);

      if (!expression || !right) return null;

      expression = {
        type: "and",
        left: expression,
        right,
      };

      continue;
    }

    const next = parser.tokens[parser.position];

    if (!next || next === ")" || isOperator(parser, "OR")) {
      break;
    }

    const right = parseNotExpression(parser);

    if (!expression || !right) return null;

    expression = {
      type: "and",
      left: expression,
      right,
    };
  }

  return expression;
}

/** Parses NOT expressions. */
function parseNotExpression(
  parser: SearchQueryParser,
): SearchExpression | null {
  if (isOperator(parser, "NOT")) {
    parser.position++;

    const expression = parseNotExpression(parser);

    if (!expression) return null;

    return {
      type: "not",
      expression,
    };
  }

  return parsePrimaryExpression(parser);
}

/** Parses a primary expression, which can be a parenthesized expression or a single search entry. */
function parsePrimaryExpression(
  parser: SearchQueryParser,
): SearchExpression | null {
  const token = parser.tokens[parser.position];

  if (!token || token === ")") return null;

  if (token === "(") {
    parser.position++;

    const expression = parseOrExpression(parser);

    if (!expression || parser.tokens[parser.position] !== ")") {
      return null;
    }

    parser.position++;

    return expression;
  }

  const entry = parseSearchEntry(token);

  if (!entry) return null;

  parser.position++;

  return {
    type: "condition",
    entry,
  };
}

/** Parses one qualifier:value token. */
function parseSearchEntry(token: string): ParsedSearchEntry | null {
  const match = token.match(/^([a-zA-Z0-9_]+):(.+)$/);

  if (!match) return null;

  return {
    key: match[1].toLowerCase(),
    value: coerceSearchValue(unquoteSearchValue(match[2])),
  };
}

/** Checks whether the current token is a specific Boolean operator. */
function isOperator(
  parser: SearchQueryParser,
  operator: "AND" | "OR" | "NOT",
): boolean {
  return parser.tokens[parser.position]?.toUpperCase() === operator;
}
