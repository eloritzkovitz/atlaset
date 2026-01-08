import { FaDownload, FaFileImage } from "react-icons/fa6";
import { ActionButton, CollapsibleHeader, SelectInput, Separator } from "@components";
import { SvgOptions } from "./options/SvgOptions";
import { ImageOptions } from "./options/ImageOptions";
import { EXPORT_FORMAT_OPTIONS, PNG_SCALE_OPTIONS } from "../constants/exportOptions";
import type { ExportFormat, ImageExportOptions, SvgExportOptions } from "../types";

interface DownloadMapSectionProps {
  format: ExportFormat;
  setFormat: (f: ExportFormat) => void;
  svgOptions: React.MutableRefObject<SvgExportOptions>;
  imageOptions: React.MutableRefObject<ImageExportOptions>;
  handleExport: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
  downloadExpanded: boolean;
  setDownloadExpanded: (v: boolean) => void;
}

export function DownloadMapSection({
  format,
  setFormat,
  svgOptions,
  imageOptions,
  handleExport,
  svgRef,
  downloadExpanded,
  setDownloadExpanded,
}: DownloadMapSectionProps) {
  return (
    <CollapsibleHeader
      icon={<FaDownload />}
      label="Download"
      expanded={downloadExpanded}
      onToggle={() => setDownloadExpanded(!downloadExpanded)}
    >
      {/* Format selector */}
      <div className="mb-4 mt-1 text-muted text-xs font-semibold uppercase tracking-wide">
        Format
      </div>
      <SelectInput
        label=""
        value={format}
        onChange={(val) => setFormat(val as ExportFormat)}
        options={EXPORT_FORMAT_OPTIONS}
      />
      <Separator className="mb-4" />
      {/* Options section header */}
      <div className="mb-4 mt-1 text-muted text-xs font-semibold uppercase tracking-wide">
        Options
      </div>
      {/* SVG options */}
      {format === "svg" && (
        <SvgOptions
          onOptionsChange={(opts) => {
            svgOptions.current = opts;
          }}
        />
      )}
      {/* Image options */}
      {format !== "svg" && (
        <ImageOptions
          format={format}
          scaleOptions={PNG_SCALE_OPTIONS}
          onOptionsChange={(opts) => {
            imageOptions.current = opts;
          }}
        />
      )}
      {/* Export button */}
      <div className="mt-4">
        <ActionButton
          variant="primary"
          onClick={handleExport}
          className="w-full"
          aria-label={"Export"}
          disabled={!svgRef?.current}
        >
          <FaFileImage className="inline" />
          Download Image
        </ActionButton>
      </div>
    </CollapsibleHeader>
  );
}