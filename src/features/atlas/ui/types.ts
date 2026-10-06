import type { Dispatch, SetStateAction } from "react";

/** Represents the orientation of the map toolbar. */
export type MapToolbarOrientation = "horizontal" | "vertical";

/** Properties for the map zoom component. */
export interface ZoomControlProps {
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
}
