/** Represents a point in two-dimensional space. */
export type Point = {
  x: number;
  y: number;
};

/** Represents a two-dimensional spatial transformation state. */
export interface TransformState {
  x: number;
  y: number;
  k: number;
}
