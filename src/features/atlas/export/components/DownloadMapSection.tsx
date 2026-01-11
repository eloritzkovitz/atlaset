import { FaDownload } from "react-icons/fa6";
import {
  ActionButton,
  CollapsibleHeader,
  SectionHeader,
  SelectInput,
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
import { exportMap, exportMapDataAsJson } from "../utils/mapExport";

interface DownloadMapSectionProps {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
  format: ExportFormat;
  setFormat: (f: ExportFormat) => void;
  svgOptions: React.RefObject<SvgExportOptions>;
  imageOptions: React.RefObject<ImageExportOptions>;
}

export function DownloadMapSection({
  expanded,
  setExpanded,
  svgRef,
  format,
  setFormat,
  svgOptions,
  imageOptions,
}: DownloadMapSectionProps) {
  const { layers } = useLayers();
  const { markers } = useMarkers();

  // Export map as SVG or image
  const handleExport = () => {
    exportMap({
      svgRef,
      format,
      svgOptions,
      imageOptions,
    });
  };

  // Download map data as JSON
  const handleDownloadJson = () => {
    exportMapDataAsJson({ layers, markers }, "atlas-data.json");
  };

  return (
    <CollapsibleHeader
      icon={<FaDownload />}
      label="Download"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {/* Format selector */}
      <SectionHeader title="Format" className="!-mb-2" />
      <SelectInput
        label=""
        value={format}
        onChange={(val) => setFormat(val as ExportFormat)}
        options={EXPORT_FORMAT_OPTIONS}
      />
      {/* Options section header */}
      <SectionHeader title="Options" />
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
      <SectionHeader title="Download Data" />
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
