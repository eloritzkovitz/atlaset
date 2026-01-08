import { useState } from "react";
import { FaShareNodes, FaCopy } from "react-icons/fa6";
import { CollapsibleHeader, ActionButton, Checkbox } from "@components";
import { encodeMapLayers } from "../utils/mapShare";
import { DEFAULT_VISITED_LAYER } from "@features/atlas/layers/constants/layers";

interface ShareMapSectionProps {
  exportMode: "visited" | "layers";
  setExportMode: (mode: "visited" | "layers") => void;
  allLayers: any[];
  visitedCountryCodes: string[];
  shareExpanded: boolean;
  setShareExpanded: (v: boolean) => void;
}

export function ShareMapSection({
  exportMode,
  setExportMode,
  allLayers,
  visitedCountryCodes,
  shareExpanded,
  setShareExpanded,
}: ShareMapSectionProps) {
  const [shareCopied, setShareCopied] = useState(false);

  let layersToShare;
  if (exportMode === "visited") {
    layersToShare = [
      {
        id: DEFAULT_VISITED_LAYER.id,
        color: DEFAULT_VISITED_LAYER.color,
        countries: visitedCountryCodes,
      },
    ];
  } else {
    layersToShare = allLayers
      .filter((l) => l.visible && l.countries && l.countries.length > 0)
      .map((l) => ({
        id: l.id,
        color: l.color,
        countries: l.countries,
      }));
  }
  const code = encodeMapLayers(layersToShare);
  const shareUrl = `${window.location.origin}/atlas?map=${code}`;

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
        Include
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <Checkbox
          checked={exportMode === "visited"}
          onChange={() => setExportMode("visited")}
          label="Visited countries"
          aria-checked={exportMode === "visited"}
          aria-label="Visited countries"
        />
        <Checkbox
          checked={exportMode === "layers"}
          onChange={() => setExportMode("layers")}
          label="All visible layers"
          aria-checked={exportMode === "layers"}
          aria-label="All visible layers"
        />
      </div>
      <div className="mt-4 mb-4 text-muted text-xs font-semibold uppercase tracking-wide">
        Shareable Link
      </div>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 px-2 py-1 rounded-lg bg-input text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ minWidth: 0 }}
          onFocus={(e) => e.target.select()}
        />
        <ActionButton
          onClick={handleCopyShare}
          ariaLabel="Copy share link"
          title={shareCopied ? "Copied!" : "Copy link"}
          icon={<FaCopy />}
          variant="secondary"
        />
      </div>
    </CollapsibleHeader>
  );
}
