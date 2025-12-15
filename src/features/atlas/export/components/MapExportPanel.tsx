import { useRef, useState } from "react";
import { FaDownload, FaFileImage, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, SelectInput, Separator } from "@components";
import { useUI } from "@contexts/UIContext";
import { SvgOptions } from "./SvgOptions";
import { ImageOptions } from "./ImageOptions";
import {
  EXPORT_FORMAT_OPTIONS,
  PNG_SCALE_OPTIONS,
} from "../constants/exportOptions";
import type {
  ExportFormat,
  ImageExportOptions,
  SvgExportOptions,
} from "../types";
import { exportSvg, exportSvgAsImage } from "../utils/mapExport";
import "./MapExportPanel.css";

export interface MapExportPanelProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function MapExportPanel({ svgRef }: MapExportPanelProps) {
  const { showExport, closePanel } = useUI();

  // Export options state
  const [format, setFormat] = useState<ExportFormat>("svg");
  const svgOptions = useRef<SvgExportOptions>({ svgInlineStyles: true });
  const imageOptions = useRef<ImageExportOptions>({
    scale: 2,
    quality: 1,
    backgroundColor: "#ffffff",
  });

  // Export handler
  const handleExport = () => {
    if (!svgRef?.current) return;
    if (format === "svg") {
      exportSvg(svgRef.current, "map.svg", svgOptions.current.svgInlineStyles);
    } else {
      const ext = format === "jpeg" ? "jpg" : format;
      exportSvgAsImage(
        svgRef.current,
        `map@${imageOptions.current.scale}x.${ext}`,
        format,
        imageOptions.current.scale,
        true,
        8192,
        imageOptions.current.quality,
        imageOptions.current.backgroundColor
      );
    }
    closePanel();
  };

  return (
    <Panel
      title={
        <>
          <FaDownload />
          Export
        </>
      }
      show={showExport}
      onHide={closePanel}
      headerActions={
        <ActionButton
          onClick={closePanel}
          ariaLabel="Close export menu"
          title="Close"
          icon={<FaXmark className="text-2xl" />}
          rounded
        />
      }
    >
      <div className="pb-20">
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
      </div>

      {/* Export button */}
      <div className="absolute bottom-0 left-0 w-full px-4 pb-4">
        <ActionButton
          variant="primary"
          onClick={handleExport}
          className="w-full"
          aria-label={"Export"}
          title={"Export"}
          disabled={!svgRef?.current}
        >
          <FaFileImage className="inline" />
          Export
        </ActionButton>
      </div>
    </Panel>
  );
}
