import { MAX_COUNTRIES_BEFORE_EXPAND } from "./constants";
import { ExpandCollapseButton } from "./ExpandCollapseButton";

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
  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col-reverse items-start">
      {showExpand && (
        <ExpandCollapseButton
          expanded={isExpanded}
          count={names.length - MAX_COUNTRIES_BEFORE_EXPAND}
          onClick={isExpanded ? onCollapse : onExpand}
        />
      )}
      <ul className="list-disc list-inside pl-4 space-y-0.5 text-left text-muted mb-1 select-none">
        {names
          .slice(0, isExpanded ? names.length : MAX_COUNTRIES_BEFORE_EXPAND)
          .map((name) => (
            <li
              key={name}
              className="text-xs truncate max-w-[120px] px-1 rounded"
              title={name}
            >
              {name}
            </li>
          ))}
      </ul>
    </div>
  );
}
