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
}

export function VisitedStatusIndicator({
  country,
  className = "",
}: VisitedStatusIndicatorProps) {
  const { homeCountry } = useHomeCountry();
  const { isVisitedCountry, isFutureVisitCountry, isWantToVisitCountry } =
    useVisitedCountries();
  const { t } = useTranslation("atlas");

  const isHome = homeCountry === country.isoCode;
  const isVisited = isVisitedCountry(country.isoCode);
  const isFuture = isFutureVisitCountry(country.isoCode);
  const isWantToVisit = isWantToVisitCountry(country.isoCode);

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
    wantToVisit: {
      tooltipKey: "countries.details.status.wantToVisit",
      ariaKey: "countries.details.status.wantToVisit",
      icon: "wantToVisit",
      color: NOT_VISITED_COLOR,
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
        : isWantToVisit
          ? "wantToVisit"
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
