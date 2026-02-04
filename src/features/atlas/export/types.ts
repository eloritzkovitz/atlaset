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
