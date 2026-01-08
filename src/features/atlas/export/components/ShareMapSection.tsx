import { useState } from "react";
import { FaShareNodes, FaCopy } from "react-icons/fa6";
import {
  ActionButton,
  Checkbox,
  CollapsibleHeader,
  InputBox,
} from "@components";
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

  // Generate shareable URL
  let layersToShare;
  if (exportMode === "visited") {
    const visitedLayer = allLayers.find(
      (l) => l.id === DEFAULT_VISITED_LAYER.id
    );
    layersToShare = [
      {
        id: visitedLayer?.id ?? DEFAULT_VISITED_LAYER.id,
        color: visitedLayer?.color ?? DEFAULT_VISITED_LAYER.color,
        countries: visitedLayer?.countries ?? visitedCountryCodes,
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
