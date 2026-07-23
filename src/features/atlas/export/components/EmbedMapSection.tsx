import { useState } from "react";
import { FaCode, FaCopy } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import {
  CollapsibleHeader,
  InputBox,
  ActionButton,
  SectionHeader,
} from "@components";

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
  const { t } = useTranslation("atlas");

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
      label={t("mapExport.embed.title")}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <SectionHeader title={t("mapExport.embed.embedCode")} />
      <div className="flex items-center gap-1 mb-2">
        <InputBox
          id="embed-code"
          name="embed-code"
          type="text"
          value={embedCode}
          readOnly
          className="flex-1 font-mono"
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
          aria-label={t("mapExport.embed.embedCode")}
        />
        <ActionButton
          variant="action"
          onClick={handleCopyEmbed}
          ariaLabel={t("mapExport.embed.copyEmbedCode")}
          title={
            embedCopied
              ? t("mapExport.embed.embedCodeCopied")
              : t("mapExport.embed.copyEmbedCode")
          }
          icon={<FaCopy className="text-xl" />}
          className="bg-transparent !h-10 !w-10 mt-1 rounded-lg"
        />
      </div>
      <span className="text-xs text-muted">
        {t("mapExport.embed.description")}
      </span>
    </CollapsibleHeader>
  );
}
