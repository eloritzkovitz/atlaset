import { useState } from "react";
import { FaCode, FaCopy } from "react-icons/fa6";
import { CollapsibleHeader, InputBox, ActionButton } from "@components";
import { useLayers } from "@contexts/LayersContext";
import { DEFAULT_VISITED_LAYER } from "@features/atlas/layers/constants/layers";
import { encodeMapData } from "../utils/mapShare";

interface EmbedMapSectionProps {
  visitedCountryCodes: string[];
  exportMode: "visited" | "layers";
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}

// Generate embed URL with encoded map data
function getEmbedUrl(code: string) {
  return `${window.location.origin}/atlas?map=${code}&embed`;
}

export function EmbedMapSection({
  visitedCountryCodes,
  exportMode,
  expanded,
  setExpanded,
}: EmbedMapSectionProps) {
  const { layers: allLayers } = useLayers();

  const [embedCopied, setEmbedCopied] = useState(false);

  // Prepare layers for embedding
  const visitedLayer = allLayers.find((l) => l.id === DEFAULT_VISITED_LAYER.id);
  const layersToEmbed = [
    {
      name: visitedLayer?.name ?? DEFAULT_VISITED_LAYER.name,
      color: visitedLayer?.color ?? DEFAULT_VISITED_LAYER.color,
      countries: visitedLayer?.countries ?? visitedCountryCodes,
    },
  ];

  // Prepare map data for embedding
  const code = encodeMapData({
    layers: layersToEmbed,
  });

  // Generate embed URL and code snippet
  const embedUrl = getEmbedUrl(code);
  const embedCode = `<iframe src=\"${embedUrl}\" width=\"960\" height=\"500\" frameborder=\"0\" style=\"border:0;max-width:100%\"></iframe>`;

  // Copy embed code to clipboard
  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 1500);
  };

  return (
    <CollapsibleHeader
      icon={<FaCode />}
      label="Embed"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className="mt-2 mb-2 text-muted text-xs font-semibold uppercase tracking-wide">
        Embed Code
      </div>
      <div className="flex items-center gap-1 mb-2">
        <InputBox
          value={embedCode}
          readOnly
          className="flex-1 font-mono"
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
          aria-label="Embed code"
        />
        <ActionButton
          variant="action"
          onClick={handleCopyEmbed}
          ariaLabel="Copy embed code"
          title={embedCopied ? "Copied!" : "Copy code"}
          icon={<FaCopy className="text-xl" />}
          className="bg-transparent !h-10 !w-10 mt-1 rounded-lg"
        />
      </div>
      <span className="text-xs text-muted">
        Embed this map in your website using the code above.
      </span>
    </CollapsibleHeader>
  );
}
