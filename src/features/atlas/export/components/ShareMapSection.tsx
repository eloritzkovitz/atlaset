import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@contexts/AuthContext";
import { FaShareNodes, FaCopy } from "react-icons/fa6";
import {
  ActionButton,
  CollapsibleHeader,
  FormField,
  InputBox,
} from "@components";
import { encodeMapData } from "../utils/mapShare";

interface ShareMapSectionProps {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  layers: Array<{
    name: string;
    color: string;
    countries: string[];
  }>;
  markers:
    | Array<{
        name?: string;
        coordinates: [number, number];
        color?: string;
        description?: string;
      }>
    | undefined;
}

export function ShareMapSection({
  expanded,
  setExpanded,
  layers,
  markers,
}: ShareMapSectionProps) {
  const auth = useContext(AuthContext);

  const [shareCopied, setShareCopied] = useState(false);
  const [mapName, setMapName] = useState("");
  const [sharer, setSharer] = useState("");

  // Prefill sharer with authenticated user's displayName if available
  useEffect(() => {
    if (!sharer && auth?.user?.displayName) {
      setSharer(auth.user.displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user?.displayName]);

  // Encode map data into shareable code
  const code = encodeMapData({
    layers: layers,
    mapName: mapName.trim() || undefined,
    sharer: sharer.trim() || undefined,
    markers: markers,
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
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
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
