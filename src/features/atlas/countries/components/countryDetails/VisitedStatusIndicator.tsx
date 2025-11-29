import { FaCircleCheck, FaCircleXmark, FaHouse } from "react-icons/fa6";

interface VisitedStatusIndicatorProps {
  visited: boolean;
  isHome?: boolean; 
  className?: string;
};

export function VisitedStatusIndicator({
  visited,
  isHome = false,
  className = "",
}: VisitedStatusIndicatorProps) {
  if (isHome) {
    return (
      <FaHouse
        className={`w-5 h-5 ${className}`}
        color="#22c55e"
        title="Home country"
        aria-label="Home country"
      />
    );
  }
  return visited ? (
    <FaCircleCheck
      className={`w-5 h-5 ${className}`}
      color="#22c55e"
      title="Visited"
      aria-label="Visited"
    />
  ) : (
    <FaCircleXmark
      className={`w-5 h-5 ${className}`}
      color="#d1d5db"
      title="Not visited"
      aria-label="Not visited"
    />
  );
}
