import { useTranslation } from "react-i18next";
import { Tooltip } from "@components";
import { HOME_COUNTRY_COLOR } from "@constants/colors";
import { ICONS } from "@constants/icons";

interface VisitedStatusIndicatorProps {
  visited: boolean;
  isHome?: boolean;
  isUpcoming?: boolean;
  className?: string;
}

export function VisitedStatusIndicator({
  visited,
  isHome = false,
  isUpcoming = false,
  className = "",
}: VisitedStatusIndicatorProps) {
  const { t } = useTranslation("atlas");

  if (isHome) {
    return (
      <Tooltip content={t("countries.details.status.home")} position="bottom">
        <ICONS.visitStatus.home
          className={`w-5 h-5 ${className}`}
          color={HOME_COUNTRY_COLOR}
          aria-label={t("countries.details.status.home")}
        />
      </Tooltip>
    );
  }
  if (isUpcoming) {
    return (
      <Tooltip
        content={t("countries.details.status.upcoming")}
        position="bottom"
      >
        <ICONS.visitStatus.upcoming
          className={`w-5 h-5 ${className}`}
          color="#f59e0b"
          aria-label={t("countries.details.status.upcomingAria")}
        />
      </Tooltip>
    );
  }

  return visited ? (
    <Tooltip content={t("countries.details.status.visited")} position="bottom">
      <ICONS.visitStatus.visited
        className={`w-5 h-5 ${className}`}
        color="#22c55e"
        aria-label={t("countries.details.status.visitedAria")}
      />
    </Tooltip>
  ) : (
    <Tooltip
      content={t("countries.details.status.notVisited")}
      position="bottom"
    >
      <ICONS.visitStatus.notVisited
        className={`w-5 h-5 ${className}`}
        color="#d1d5db"
        aria-label={t("countries.details.status.notVisitedAria")}
      />
    </Tooltip>
  );
}
