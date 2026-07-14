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
