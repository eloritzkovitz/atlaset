import { FaCircleCheck, FaCircleXmark, FaHouse } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("atlas");

  if (isHome) {
    return (
      <Tooltip content={t("countries.details.status.home")} position="bottom">
        <FaHouse
          className={`w-5 h-5 ${className}`}
          color="#22c55e"
          aria-label={t("countries.details.status.homeAria")}
        />
      </Tooltip>
    );
  }
  return visited ? (
    <Tooltip content={t("countries.details.status.visited")} position="bottom">
      <FaCircleCheck
        className={`w-5 h-5 ${className}`}
        color="#22c55e"
        aria-label={t("countries.details.status.visitedAria")}
      />
    </Tooltip>
  ) : (
    <Tooltip content={t("countries.details.status.notVisited")} position="bottom">
      <FaCircleXmark
        className={`w-5 h-5 ${className}`}
        color="#d1d5db"
        aria-label={t("countries.details.status.notVisitedAria")}
      />
    </Tooltip>
  );
}
