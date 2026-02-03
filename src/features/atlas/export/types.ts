import type { Marker } from "@features/atlas/markers/types";

//** Export modes for the map. */
export type ExportMode = "visited" | "layers";

/** Export formats for the map. */
export type ExportFormat = "svg" | "png" | "jpeg" | "webp";

/** Image formats for export. */
export type ImageFormat = "png" | "jpeg" | "webp";

/** Options for exporting SVG. */
export type SvgExportOptions = {
  svgInlineStyles: boolean;
};

/** Options for exporting images. */
export type ImageExportOptions = {
  scale: number;
  quality: number;
  backgroundColor?: string;
};

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
