// SortKey type definition
export type SortKey<T> = Extract<keyof T, string>;

/** Represents the direction of sorting. */
export type SortDirection = "asc" | "desc";

/** Represents a sorting value composed of a key and direction. */
export type SortValue<K extends string> = `${K}-${SortDirection}`;
