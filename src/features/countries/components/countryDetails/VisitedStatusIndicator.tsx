import { FaCircleCheck, FaCircleXmark, FaHouse } from "react-icons/fa6";
import { Tooltip } from "@components";

interface VisitedStatusIndicatorProps {
  visited: boolean;
  isHome?: boolean;
  className?: string;
}

export function VisitedStatusIndicator({
  visited,
  isHome = false,
  className = "",
}: VisitedStatusIndicatorProps) {
  if (isHome) {
    return (
      <Tooltip content="Home country" position="bottom">
        <FaHouse
          className={`w-5 h-5 ${className}`}
          color="#22c55e"
          aria-label="Home country"
        />
      </Tooltip>
    );
  }
  return visited ? (
    <Tooltip content="Visited" position="bottom">
      <FaCircleCheck
        className={`w-5 h-5 ${className}`}
        color="#22c55e"
        aria-label="Visited"
      />
    </Tooltip>
  ) : (
    <Tooltip content="Not visited" position="bottom">
      <FaCircleXmark
        className={`w-5 h-5 ${className}`}
        color="#d1d5db"
        aria-label="Not visited"
      />
    </Tooltip>
  );
}
