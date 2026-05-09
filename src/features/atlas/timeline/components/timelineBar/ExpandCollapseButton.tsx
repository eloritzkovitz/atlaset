import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface ExpandCollapseButtonProps {
  expanded: boolean;
  count?: number;
  onClick: () => void;
}

export function ExpandCollapseButton({
  expanded,
  count,
  onClick,
}: ExpandCollapseButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center text-xs text-muted underline cursor-pointer pointer-events-auto ms-4"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {!expanded ? (
        <>
          <span className="me-1 text-xs">+{count}</span>
          <FaChevronDown className="inline-block" />
        </>
      ) : (
        <FaChevronUp className="inline-block me-1" />
      )}
    </button>
  );
}
