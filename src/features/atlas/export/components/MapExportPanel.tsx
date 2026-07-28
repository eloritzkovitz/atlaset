import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@contexts/UIContext";
import { useEffectiveLayers } from "@features/atlas/layers";
import { useMapView } from "@features/atlas/map";
import { useEffectiveMarkers } from "@features/atlas/markers";
import { useSavedMaps } from "@features/atlas/savedMaps";
import { useAccessibility } from "@features/settings";
import { useAuth } from "@features/user/auth";
import { useVisitedCountries } from "@features/visits";
import { DownloadMapSection } from "./DownloadMapSection";
import { EmbedMapSection } from "./EmbedMapSection";
import { ExportOptionsSection } from "./ExportOptionsSection";
import { ShareMapSection } from "./ShareMapSection";
import { useExportData } from "../hooks/useExportData";
import { useSharedMapInfo } from "../hooks/useSharedMapInfo";
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
  const { animationsEnabled } = useAccessibility();
  const { user } = useAuth();
  const { isReadonly } = useMapView();
  const { activeSavedMap } = useSavedMaps();
  const sharedMapInfo = useSharedMapInfo() || {};
  const { showExport, closePanel } = useUI();
  const { visitedCountryCodes } = useVisitedCountries();
  const allLayers = useEffectiveLayers();
  const markers = useEffectiveMarkers();
  const { t } = useTranslation("atlas");

  // Export options state
  const [includeVisitedCountries, setIncludeVisitedCountries] = useState(true);
  const [includeLayers, setIncludeLayers] = useState(true);
  const [includeMarkers, setIncludeMarkers] = useState(false);
  const [mapName, setMapName] = useState("");
  const effectiveMapName = activeSavedMap?.name || mapName;
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
      visitedCountryCodes: includeVisitedCountries ? visitedCountryCodes : [],
      layers: includeLayers ? allLayers : [],
      markers: includeMarkers ? markers : [],
    });

  // Prefill mapName with shared map info if available and no map is selected
  useEffect(() => {
    if (!activeSavedMap && !mapName && sharedMapInfo.mapName) {
      setMapName(sharedMapInfo.mapName);
    }
  }, [activeSavedMap, mapName, sharedMapInfo.mapName]);

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
      ...(!activeSavedMap &&
      includeVisitedCountries &&
      visitedCountriesLayer.countries.length > 0
        ? [visitedCountriesLayer]
        : []),
    ],
    mapName: effectiveMapName.trim() || undefined,
    sharer: sharer.trim() || undefined,
    markers: markersToShare,
  });

  return (
    <Panel
      title={
        <>
          {!isReadonly ? <ICONS.share /> : <ICONS.download />}
          {!isReadonly ? t("mapExport.title") : t("mapExport.download")}
        </>
      }
      show={showExport}
      onHide={closePanel}
      animationsEnabled={animationsEnabled}
    >
      <div>
        <ExportOptionsSection
          includeVisitedCountries={includeVisitedCountries}
          setIncludeVisitedCountries={setIncludeVisitedCountries}
          includeLayers={includeLayers}
          setIncludeLayers={setIncludeLayers}
          includeMarkers={includeMarkers}
          setIncludeMarkers={setIncludeMarkers}
          mapName={effectiveMapName}
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
