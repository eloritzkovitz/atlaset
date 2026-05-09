import { useLanguage } from "@features/settings";
import { ExpandCollapseButton } from "./ExpandCollapseButton";
import { MAX_COUNTRIES_BEFORE_EXPAND } from "../../constants/timeline";

interface VisitedCountryNamesProps {
  names: string[];
  isExpanded: boolean;
  showExpand: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export function VisitedCountryNames({
  names,
  isExpanded,
  showExpand,
  onExpand,
  onCollapse,
}: VisitedCountryNamesProps) {
  const { isRtl } = useLanguage();

  return (
    <div
      className={`bg-bg/50 absolute bottom-12 start-1/2 ${
        isRtl ? "translate-x-1/2" : "-translate-x-1/2"
      } flex flex-col-reverse ${isRtl ? "items-end" : "items-start"} rounded-lg`}
    >
      {showExpand && (
        <ExpandCollapseButton
          expanded={isExpanded}
          count={names.length - MAX_COUNTRIES_BEFORE_EXPAND}
          onClick={isExpanded ? onCollapse : onExpand}
        />
      )}
      <ul className="list-disc list-inside ps-4 space-y-0.5 text-start text-muted mb-1 select-none">
        {names
          .slice(0, isExpanded ? names.length : MAX_COUNTRIES_BEFORE_EXPAND)
          .map((name) => (
            <li
              key={name}
              className="text-xs truncate max-w-[120px] px-1 rounded"
            >
              {name}
            </li>
          ))}
      </ul>
    </div>
  );
}
