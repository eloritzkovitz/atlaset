import { FaShareNodes, FaCopy } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  CollapsibleHeader,
  InputBox,
  SectionHeader,
} from "@components";
import { useMapShare } from "../hooks/useMapShare";

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
  const { shareUrl, copyShareUrl, copied } = useMapShare(code);
  const { t } = useTranslation("atlas");

  return (
    <CollapsibleHeader
      icon={<FaShareNodes />}
      label={t("mapExport.share")}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <SectionHeader title={t("mapExport.shareableLink")} />
      <div className="flex items-center gap-1 mb-4">
        <InputBox
          value={shareUrl}
          readOnly
          className="flex-1 font-mono"
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
          aria-label={t("mapExport.shareableLink")}
        />
        <ActionButton
          variant="action"
          onClick={copyShareUrl}
          ariaLabel={t("mapExport.copyLink")}
          title={copied ? t("mapExport.linkCopied") : t("mapExport.copyLink")}
          icon={<FaCopy className="text-xl" />}
          className="bg-transparent !h-10 !w-10 mt-1 rounded-lg"
        />
      </div>
    </CollapsibleHeader>
  );
}
