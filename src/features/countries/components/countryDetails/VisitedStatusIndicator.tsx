import { useTranslation } from "react-i18next";
import { Tooltip } from "@components";
import {
  HOME_COUNTRY_COLOR,
  NOT_VISITED_COLOR,
  PLANNED_VISIT_COLOR,
  VISITED_COLOR,
} from "@constants/colors";
import { ICONS } from "@constants/icons";
import { useHomeCountry } from "@features/user/profile";
import { useCountryTracking } from "@features/visits";
import type { Country } from "../../types";

const STATUS_CONFIG = {
  home: {
    translationKey: "countries.details.status.home",
    icon: "home",
    color: HOME_COUNTRY_COLOR,
  },
  future: {
    translationKey: "countries.details.status.future",
    icon: "future",
    color: PLANNED_VISIT_COLOR,
  },
  visited: {
    translationKey: "countries.details.status.visited",
    icon: "visited",
    color: VISITED_COLOR,
  },
  notVisited: {
    translationKey: "countries.details.status.notVisited",
    icon: "notVisited",
    color: NOT_VISITED_COLOR,
  },
} as const;

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
  const { isVisitedCountry, isFutureVisitCountry } = useCountryTracking();
  const { t } = useTranslation("atlas");

  const isHome = homeCountry === country.isoCode;
  const isVisited = isVisitedCountry(country.isoCode);
  const isFuture = isFutureVisitCountry(country.isoCode);

  const status = isHome
    ? "home"
    : isFuture
      ? "future"
      : isVisited
        ? "visited"
        : "notVisited";

  const cfg = STATUS_CONFIG[status];
  const Icon = ICONS.visitStatus[cfg.icon];
  const label = t(cfg.translationKey);

  const content = (
    <Icon
      className={`w-5 h-5 ${className}`}
      color={cfg.color}
      aria-label={label}
    />
  );

  return (
    <Tooltip content={label} position="bottom">
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center justify-center rounded-full p-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label={label}
        >
          {content}
        </button>
      ) : (
        content
      )}
    </Tooltip>
  );
}
