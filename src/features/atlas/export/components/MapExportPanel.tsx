import { useEffect, useRef, useState } from "react";
import { FaXmark, FaShareFromSquare, FaDownload } from "react-icons/fa6";
import { ActionButton, Panel, Separator } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useSharedMapInfo } from "@features/atlas/export";
import { useUI } from "@contexts/UIContext";
import { useEffectiveLayers } from "@features/atlas/layers";
import { useEffectiveMarkers } from "@features/atlas/markers";
import { useVisitedCountries } from "@features/visits";
import { DownloadMapSection } from "./DownloadMapSection";
import { EmbedMapSection } from "./EmbedMapSection";
import { ExportOptionsSection } from "./ExportOptionsSection";
import { ShareMapSection } from "./ShareMapSection";
import { useExportData } from "../hooks/useExportData";
import type {
  ExportFormat,
  ImageExportOptions,
  SvgExportOptions,
} from "../types";
import { encodeMapData } from "../utils/mapShare";
import "./MapExportPanel.css";

export interface MapExportPanelProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function MapExportPanel({ svgRef }: MapExportPanelProps) {
  const { user } = useAuth();
  const { isReadonly } = useMapView();
  const { editingSavedMap } = useSavedMaps();
  const sharedMapInfo = useSharedMapInfo() || {};
  const { showExport, closePanel } = useUI();
  const { visitedCountryCodes } = useVisitedCountries();
  const allLayers = useEffectiveLayers();
  const markers = useEffectiveMarkers();

  // Export options state
  const [includeVisitedCountries, setIncludeVisitedCountries] = useState(true);
  const [includeLayers, setIncludeLayers] = useState(true);
  const [includeMarkers, setIncludeMarkers] = useState(false);
  const [mapName, setMapName] = useState("");
  const [sharer, setSharer] = useState("");

  // Collapsible headers state
  const [downloadExpanded, setDownloadExpanded] = useState(true);
  const [shareExpanded, setShareExpanded] = useState(true);
  const [embedExpanded, setEmbedExpanded] = useState(true);

  // Image export options state
  const [format, setFormat] = useState<ExportFormat>("svg");
  const svgOptions = useRef<SvgExportOptions>({ svgInlineStyles: true });
  const imageOptions = useRef<ImageExportOptions>({
    scale: 2,
    quality: 1,
    backgroundColor: "#ffffff",
  });

  // Prepare export data
  const { visitedCountriesLayer, layersToShare, markersToShare } =
    useExportData({
      allLayers: includeLayers ? allLayers : [],
      visitedCountryCodes: includeVisitedCountries ? visitedCountryCodes : [],
      includeMarkers,
      markers,
    });

  // Prefill mapName with saved map name if available
  useEffect(() => {
    if (!mapName) {
      if (editingSavedMap?.name) {
        setMapName(editingSavedMap.name);
      } else if (sharedMapInfo.mapName) {
        setMapName(sharedMapInfo.mapName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSavedMap?.name, sharedMapInfo.mapName]);

  // Prefill sharer with authenticated user's displayName if available
  useEffect(() => {
    if (!sharer && user?.displayName) {
      setSharer(user.displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.displayName]);

  // Encode map data into shareable code
  const code = encodeMapData({
    layers: [
      ...(includeLayers ? layersToShare : []),
      ...(includeVisitedCountries && visitedCountriesLayer.countries.length > 0
        ? [visitedCountriesLayer]
        : []),
    ],
    mapName: mapName.trim() || undefined,
    sharer: sharer.trim() || undefined,
    markers: markersToShare,
  });

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
        <ExportOptionsSection
          includeVisitedCountries={includeVisitedCountries}
          setIncludeVisitedCountries={setIncludeVisitedCountries}
          includeLayers={includeLayers}
          setIncludeLayers={setIncludeLayers}
          includeMarkers={includeMarkers}
          setIncludeMarkers={setIncludeMarkers}
          mapName={mapName}
          setMapName={setMapName}
          sharer={sharer}
          setSharer={setSharer}
        />
        <Separator className="my-4" />
        <DownloadMapSection
          expanded={downloadExpanded}
          setExpanded={setDownloadExpanded}
          svgRef={svgRef}
          format={format}
          setFormat={setFormat}
          svgOptions={svgOptions}
          imageOptions={imageOptions}
        />
        {!isReadonly && (
          <>
            <Separator className="my-4" />
            <ShareMapSection
              expanded={shareExpanded}
              setExpanded={setShareExpanded}
              code={code}
            />
            <Separator className="my-4" />
            <EmbedMapSection
              expanded={embedExpanded}
              setExpanded={setEmbedExpanded}
              code={code}
            />
          </>
        )}
      </div>
    </Panel>
  );
}
