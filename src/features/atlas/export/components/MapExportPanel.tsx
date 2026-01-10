import { useRef, useState } from "react";
import { FaXmark, FaShareFromSquare, FaDownload } from "react-icons/fa6";
import { ActionButton, Checkbox, Panel, Separator } from "@components";
import { useMarkers } from "@contexts/MarkersContext";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import { useVisitedCountries } from "@features/visits";
import { DownloadMapSection } from "./DownloadMapSection";
import { ShareMapSection } from "./ShareMapSection";
import { EmbedMapSection } from "./EmbedMapSection";
import type {
  ExportFormat,
  ImageExportOptions,
  SvgExportOptions,
} from "../types";
import { exportSvg, exportSvgAsImage } from "../utils/mapExport";
import "./MapExportPanel.css";
import { DEFAULT_VISITED_LAYER } from "@features/atlas/layers/constants/layers";

export interface MapExportPanelProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function MapExportPanel({ svgRef }: MapExportPanelProps) {
  const { isReadonly } = useMapView();
  const { showExport, closePanel } = useUI();
  const { visitedCountryCodes } = useVisitedCountries();
  const { layers: allLayers } = useLayers();
  const { markers } = useMarkers();

  // Export options state
  const [exportMode, setExportMode] = useState<"visited" | "layers">("visited");
  const [includeMarkers, setIncludeMarkers] = useState(false);

  // Image export options state
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
  const [embedExpanded, setEmbedExpanded] = useState(true);

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

  // Prepare layers for sharing
  let layersToShare: Array<{
    name: string;
    color: string;
    countries: string[];
  }>;
  if (exportMode === "visited") {
    const visitedLayer = allLayers.find(
      (l) => l.id === DEFAULT_VISITED_LAYER.id
    );
    layersToShare = [
      {
        name: visitedLayer?.name ?? DEFAULT_VISITED_LAYER.name,
        color: visitedLayer?.color ?? DEFAULT_VISITED_LAYER.color,
        countries: visitedLayer?.countries ?? visitedCountryCodes,
      },
    ];
  } else {
    layersToShare = allLayers
      .filter((l) => l.visible && l.countries && l.countries.length > 0)
      .map((l) => ({
        name: l.name,
        color: l.color,
        countries: l.countries,
      }));
  }

  // Prepare markers for sharing
  let markersToShare:
    | Array<{
        name?: string;
        coordinates: [number, number];
        color?: string;
        description?: string;
      }>
    | undefined = undefined;
  if (includeMarkers) {
    markersToShare = Array.isArray(markers)
      ? markers
          .filter((m) => m.visible !== false)
          .map((m) => ({
            name: m.name,
            coordinates: m.coordinates,
            color: m.color,
            description: m.description,
          }))
      : [];
  }

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
        <div className="mb-4 text-muted text-xs font-semibold uppercase tracking-wide">
          Options
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <Checkbox
            checked={exportMode === "visited"}
            onChange={() => setExportMode("visited")}
            label="Visited countries only"
            aria-checked={exportMode === "visited"}
            aria-label="Visited countries only"
          />
          <Checkbox
            checked={exportMode === "layers"}
            onChange={() => setExportMode("layers")}
            label="All visible layers"
            aria-checked={exportMode === "layers"}
            aria-label="All visible layers"
          />
          <Checkbox
            checked={includeMarkers}
            onChange={() => setIncludeMarkers((v) => !v)}
            label="All visible markers"
            aria-checked={includeMarkers}
            aria-label="All visible markers"
          />
        </div>
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
              expanded={shareExpanded}
              setExpanded={setShareExpanded}
              layers={layersToShare}
              markers={markersToShare}
            />
            <Separator className="my-4" />
            <EmbedMapSection
              expanded={embedExpanded}
              setExpanded={setEmbedExpanded}
              layers={layersToShare}
              markers={markersToShare}
            />
          </>
        )}
      </div>
    </Panel>
  );
}
