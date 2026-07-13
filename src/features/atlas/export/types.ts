/** Export formats for the map. */
export type ExportFormat = "svg" | "png" | "jpeg" | "webp" | "json";

/** Image formats for export. */
export type ImageFormat = "png" | "jpeg" | "webp";

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
