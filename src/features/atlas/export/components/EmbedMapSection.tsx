import { useState } from "react";
import { FaCode, FaCopy } from "react-icons/fa6";
import { CollapsibleHeader, InputBox, ActionButton, SectionHeader } from "@components";

interface EmbedMapSectionProps {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  code: string;
}

// Generate embed URL with encoded map data
function getEmbedUrl(code: string) {
  return `${window.location.origin}/atlas?map=${code}&embed`;
}

export function EmbedMapSection({
  expanded,
  setExpanded,
  code,
}: EmbedMapSectionProps) {
  const [embedCopied, setEmbedCopied] = useState(false);

  // Generate embed URL and code snippet
  const embedUrl = getEmbedUrl(code);
  const embedCode = `<iframe src="${embedUrl}" width="960" height="500" frameborder="0" style="border:0;max-width:100%"></iframe>`;

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
      <SectionHeader title="Embed Code" />
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
