/** Represents a parsed search entry with a key and a value. */
export interface ParsedSearchEntry {
  key: string;
  value: boolean | string;
}

/** Represents a parsed search expression. */
export type SearchExpression =
  | {
      type: "condition";
      entry: ParsedSearchEntry;
    }
  | {
      type: "and";
      left: SearchExpression;
      right: SearchExpression;
    }
  | {
      type: "or";
      left: SearchExpression;
      right: SearchExpression;
    }
  | {
      type: "not";
      expression: SearchExpression;
    };
