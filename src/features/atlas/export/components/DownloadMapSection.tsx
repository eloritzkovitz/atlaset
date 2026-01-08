import { FaDownload } from "react-icons/fa6";
import {
  ActionButton,
  CollapsibleHeader,
  SelectInput,
  Separator,
} from "@components";
import { useLayers } from "@contexts/LayersContext";
import { useMarkers } from "@contexts/MarkersContext";
import { SvgOptions } from "./options/SvgOptions";
import { ImageOptions } from "./options/ImageOptions";
import {
  EXPORT_FORMAT_OPTIONS,
  PNG_SCALE_OPTIONS,
} from "../constants/exportOptions";
import type {
  ExportFormat,
  ImageExportOptions,
  SvgExportOptions,
} from "../types";
import { exportMapDataAsJson } from "../utils/mapExport";

interface DownloadMapSectionProps {
  format: ExportFormat;
  setFormat: (f: ExportFormat) => void;
  svgOptions: React.RefObject<SvgExportOptions>;
  imageOptions: React.RefObject<ImageExportOptions>;
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
  const { layers } = useLayers();
  const { markers } = useMarkers();

  // Download map data as JSON
  const handleDownloadJson = () => {
    exportMapDataAsJson({ layers, markers }, "atlas-data.json");
  };

  return (
    <CollapsibleHeader
      icon={<FaDownload />}
      label="Download"
      expanded={downloadExpanded}
      onToggle={() => setDownloadExpanded(!downloadExpanded)}
    >
      {/* Format selector */}
      <div className="mt-4 mb-4 mt-1 text-muted text-xs font-semibold uppercase tracking-wide">
        Format
      </div>
      <SelectInput
        label=""
        value={format}
        onChange={(val) => setFormat(val as ExportFormat)}
        options={EXPORT_FORMAT_OPTIONS}
      />
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
          <FaDownload className="inline" />
          Download Image
        </ActionButton>
      </div>
      {/* Download Data section */}
      <Separator className="my-4" />
      <div className="mb-2 mt-2 text-muted text-xs font-semibold uppercase tracking-wide">
        Download Data
      </div>
      <ActionButton
        variant="primary"
        onClick={handleDownloadJson}
        className="w-full !bg-info/50 hover:!bg-info-hover/50"
        aria-label={"Download as JSON"}
      >
        <FaDownload className="inline" />
        Download as JSON
      </ActionButton>
    </CollapsibleHeader>
  );
}
