import { useTranslation } from "react-i18next";
import { Tooltip } from "@components";
import {
  HOME_COUNTRY_COLOR,
  NOT_VISITED_COLOR,
  PLANNED_VISIT_COLOR,
  VISITED_COLOR,
} from "@constants/colors";
import { ICONS } from "@constants/icons";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import type { Country } from "../../types";

interface VisitedStatusIndicatorProps {
  country: Country;
  className?: string;
  onClick?: () => void;
}

export function VisitedStatusIndicator({
  country,
  className = "",
  onClick,
}: VisitedStatusIndicatorProps) {
  const { homeCountry } = useHomeCountry();
  const { isVisitedCountry, isFutureVisitCountry } = useVisitedCountries();
  const { t } = useTranslation("atlas");

  const isHome = homeCountry === country.isoCode;
  const isVisited = isVisitedCountry(country.isoCode);
  const isFuture = isFutureVisitCountry(country.isoCode);

  const STATUS_CONFIG = {
    home: {
      tooltipKey: "countries.details.status.home",
      ariaKey: "countries.details.status.home",
      icon: "home",
      color: HOME_COUNTRY_COLOR,
    },
    future: {
      tooltipKey: "countries.details.status.future",
      ariaKey: "countries.details.status.future",
      icon: "future",
      color: PLANNED_VISIT_COLOR,
    },
    visited: {
      tooltipKey: "countries.details.status.visited",
      ariaKey: "countries.details.status.visited",
      icon: "visited",
      color: VISITED_COLOR,
    },
    notVisited: {
      tooltipKey: "countries.details.status.notVisited",
      ariaKey: "countries.details.status.notVisited",
      icon: "notVisited",
      color: NOT_VISITED_COLOR,
    },
  } as const;

  const key: keyof typeof STATUS_CONFIG = isHome
    ? "home"
    : isFuture
      ? "future"
      : isVisited
        ? "visited"
        : "notVisited";

  const cfg = STATUS_CONFIG[key];
  const Icon = ICONS.visitStatus[cfg.icon];

  const content = (
    <Icon
      className={`w-5 h-5 ${className}`}
      color={cfg.color}
      aria-label={t(cfg.ariaKey)}
    />
  );

  return (
    <Tooltip content={t(cfg.tooltipKey)} position="bottom">
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center justify-center p-1 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label={t(cfg.ariaKey)}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </Tooltip>
  );
}
