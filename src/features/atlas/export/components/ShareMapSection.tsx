import { useState } from "react";
import { FaShareNodes, FaCopy } from "react-icons/fa6";
import { ActionButton, CollapsibleHeader, InputBox } from "@components";

interface ShareMapSectionProps {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  code: string;
}

export function ShareMapSection({
  expanded,
  setExpanded,
  code,
}: ShareMapSectionProps) {
  const [shareCopied, setShareCopied] = useState(false);

  // Generate share URL with encoded map data
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
