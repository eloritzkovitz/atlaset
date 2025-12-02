// Supported export formats
export type ExportFormat = "svg" | "png" | "jpeg" | "webp";

// Image export formats
export type ImageFormat = "png" | "jpeg" | "webp";

// SVG export options
export type SvgExportOptions = {
  svgInlineStyles: boolean;
};

// Image export options
export type ImageExportOptions = {
  scale: number;
  quality: number;
  backgroundColor?: string;
};
