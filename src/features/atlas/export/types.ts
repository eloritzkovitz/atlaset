import type { RefObject } from "react";
import type { Layer } from "../layers/types";
import type { Marker } from "../markers/types";

/** A reference to the SVG element of the map. */
export type MapSvgRef = RefObject<SVGSVGElement | null>;

/** Props for components that need a reference to the map's SVG element. */
export interface MapSvgRefProps {
  svgRef: MapSvgRef;
}

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
