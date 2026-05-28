import { useTranslation } from "react-i18next";
import { Tooltip } from "@components";
import {
  HOME_COUNTRY_COLOR,
  NOT_VISITED_COLOR,
  PLANNED_VISIT_COLOR,
  VISITED_COLOR,
} from "@constants/colors";
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

  const STATUS_CONFIG = {
    home: {
      tooltipKey: "countries.details.status.home",
      ariaKey: "countries.details.status.home",
      icon: "home",
      color: HOME_COUNTRY_COLOR,
    },
    upcoming: {
      tooltipKey: "countries.details.status.upcoming",
      ariaKey: "countries.details.status.upcomingAria",
      icon: "upcoming",
      color: PLANNED_VISIT_COLOR,
    },
    visited: {
      tooltipKey: "countries.details.status.visited",
      ariaKey: "countries.details.status.visitedAria",
      icon: "visited",
      color: VISITED_COLOR,
    },
    notVisited: {
      tooltipKey: "countries.details.status.notVisited",
      ariaKey: "countries.details.status.notVisitedAria",
      icon: "notVisited",
      color: NOT_VISITED_COLOR,
    },
  } as const;

  const key: keyof typeof STATUS_CONFIG = isHome
    ? "home"
    : isUpcoming
      ? "upcoming"
      : visited
        ? "visited"
        : "notVisited";

  const cfg = STATUS_CONFIG[key];
  const Icon = ICONS.visitStatus[cfg.icon];

  return (
    <Tooltip content={t(cfg.tooltipKey)} position="bottom">
      <Icon
        className={`w-5 h-5 ${className}`}
        color={cfg.color}
        aria-label={t(cfg.ariaKey)}
      />
    </Tooltip>
  );
}
