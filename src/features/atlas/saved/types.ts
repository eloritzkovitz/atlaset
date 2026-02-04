import type { Marker } from "../markers/types";

/** Represents a saved map. */
export interface SavedMap {
  id: string;
  name: string;
  layers: Array<{
    name: string;
    color: string;
    countries: string[];
  }>;
  markers?: Array<
    Pick<Marker, "name" | "coordinates" | "color" | "description">
  >;
  createdAt: Date | string;
}
