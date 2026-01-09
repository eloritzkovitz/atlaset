import { useRef, useState } from "react";
import { FaXmark, FaShareFromSquare, FaDownload } from "react-icons/fa6";
import { ActionButton, Panel, Separator } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import { useVisitedCountries } from "@features/visits";
import { DownloadMapSection } from "./DownloadMapSection";
import { ShareMapSection } from "./ShareMapSection";
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
  const { isReadonly } = useMapView();
  const { showExport, closePanel } = useUI();
  const { visitedCountryCodes } = useVisitedCountries();

  // Export mode: 'visited' or 'layers'
  const [exportMode, setExportMode] = useState<"visited" | "layers">("visited");

  // Export options state
  const [format, setFormat] = useState<ExportFormat>("svg");
  const svgOptions = useRef<SvgExportOptions>({ svgInlineStyles: true });
  const imageOptions = useRef<ImageExportOptions>({
    scale: 2,
    quality: 1,
    backgroundColor: "#ffffff",
  });

  // Collapsible headers state
  const [downloadExpanded, setDownloadExpanded] = useState(true);
  const [shareExpanded, setShareExpanded] = useState(true);

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
          {!isReadonly ? <FaShareFromSquare /> : <FaDownload />}
          {!isReadonly ? "Export" : "Download"}
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
      <div>
        <DownloadMapSection
          format={format}
          setFormat={setFormat}
          svgOptions={svgOptions}
          imageOptions={imageOptions}
          handleExport={handleExport}
          svgRef={svgRef}
          downloadExpanded={downloadExpanded}
          setDownloadExpanded={setDownloadExpanded}
        />
        {!isReadonly && (
          <>
            <Separator className="my-4" />
            <ShareMapSection
              exportMode={exportMode}
              setExportMode={setExportMode}
              visitedCountryCodes={visitedCountryCodes}
              shareExpanded={shareExpanded}
              setShareExpanded={setShareExpanded}
            />
          </>
        )}
      </div>
    </Panel>
  );
}
