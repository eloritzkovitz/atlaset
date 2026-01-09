import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@contexts/AuthContext";
import { FaShareNodes, FaCopy } from "react-icons/fa6";
import {
  ActionButton,
  Checkbox,
  CollapsibleHeader,
  FormField,
  InputBox,
} from "@components";
import { encodeMapData } from "../utils/mapShare";
import { DEFAULT_VISITED_LAYER } from "@features/atlas/layers/constants/layers";
import { useLayers } from "@contexts/LayersContext";
import { useMarkers } from "@contexts/MarkersContext";

interface ShareMapSectionProps {
  exportMode: "visited" | "layers";
  setExportMode: (mode: "visited" | "layers") => void;
  visitedCountryCodes: string[];
  shareExpanded: boolean;
  setShareExpanded: (v: boolean) => void;
}

export function ShareMapSection({
  exportMode,
  setExportMode,
  visitedCountryCodes,
  shareExpanded,
  setShareExpanded,
}: ShareMapSectionProps) {
  const [shareCopied, setShareCopied] = useState(false);
  const [mapName, setMapName] = useState("");
  const [sharer, setSharer] = useState("");
  const auth = useContext(AuthContext);
  const [includeMarkers, setIncludeMarkers] = useState(false);

  const { layers: allLayers } = useLayers();
  const { markers } = useMarkers();

  // Prefill sharer with authenticated user's displayName if available
  useEffect(() => {
    if (!sharer && auth?.user?.displayName) {
      setSharer(auth.user.displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?.displayName]);

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

  if (includeMarkers) {
    console.log("Markers to share:", markersToShare);
  }

  // Encode map data into shareable code
  const code = encodeMapData({
    layers: layersToShare,
    mapName: mapName.trim() || undefined,
    sharer: sharer.trim() || undefined,
    markers: markersToShare,
  });
  const shareUrl = `${window.location.origin}/atlas?map=${code}`;

  // Copy share URL to clipboard
  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1500);
  };

  return (
    <CollapsibleHeader
      icon={<FaShareNodes />}
      label="Share"
      expanded={shareExpanded}
      onToggle={() => setShareExpanded(!shareExpanded)}
    >
      <div className="mt-4 mb-4 text-muted text-xs font-semibold uppercase tracking-wide">
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
      <div className="mt-4 mb-4 text-muted text-xs font-semibold uppercase tracking-wide">
        Map Details (Optional)
      </div>
      <FormField label="Map Name">
        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder="My Shared Map"
          maxLength={64}
        />
      </FormField>
      <FormField label="Your Name">
        <input
          type="text"
          value={sharer}
          onChange={(e) => setSharer(e.target.value)}
          placeholder="Your Name"
          maxLength={32}
        />
      </FormField>
      <div className="mt-4 mb-4 text-muted text-xs font-semibold uppercase tracking-wide">
        Shareable Link
      </div>
      <div className="flex items-center gap-1 mb-4">
        <InputBox
          value={shareUrl}
          readOnly
          className="flex-1 font-mono"
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
          aria-label="Shareable link"
        />
        <ActionButton
          variant="action"
          onClick={handleCopyShare}
          ariaLabel="Copy link"
          title={shareCopied ? "Copied!" : "Copy link"}
          icon={<FaCopy className="text-xl" />}
          className="bg-transparent !h-10 !w-10 mt-1 rounded-lg"
        />
      </div>
    </CollapsibleHeader>
  );
}
