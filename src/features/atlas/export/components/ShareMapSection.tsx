import { FaShareNodes, FaCopy } from "react-icons/fa6";
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

  return (
    <CollapsibleHeader
      icon={<FaShareNodes />}
      label="Share"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <SectionHeader title="Shareable Link" />
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
          onClick={copyShareUrl}
          ariaLabel="Copy link"
          title={copied ? "Copied!" : "Copy link"}
          icon={<FaCopy className="text-xl" />}
          className="bg-transparent !h-10 !w-10 mt-1 rounded-lg"
        />
      </div>
    </CollapsibleHeader>
  );
}
