import type { Layer } from "../layers";
import type { Marker } from "../markers/types";

/** Represents a saved map. */
export interface SavedMap {
  id: string;
  name: string;
  layers: Layer[];
  markers?: Marker[];
  createdAt: Date | string;
}
