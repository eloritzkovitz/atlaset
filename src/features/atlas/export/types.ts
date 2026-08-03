import type { Layer } from "../layers/types";
import type { Marker } from "../markers/types";

/** Image formats for export. */
export type ImageFormat = "png" | "jpeg" | "webp";

/** Export formats for the map. */
export type ExportFormat = ImageFormat | "svg" | "json";

/** Options for exporting SVG. */
export type SvgExportOptions = {
  svgInlineStyles: boolean;
  includeTitles?: boolean;
};

/** Options for exporting images. */
export type ImageExportOptions = {
  scale: number;
  quality: number;
  backgroundColor?: string;
};

/** Represents shared data for the map. */
export interface SharedMapData {
  layers: Array<{
    name: string;
    color: string;
    countries: string[];
  }>;
  markers?: Array<{
    name?: string;
    isoCode?: string;
    color?: string;
    notes?: string;
  }>;
  mapName?: string;
  sharer?: string;
}

/** Represents decoded data for the map. */
export interface DecodedMapData {
  layers: Layer[];
  markers?: Marker[];
  mapName?: string;
  sharer?: string;
}
