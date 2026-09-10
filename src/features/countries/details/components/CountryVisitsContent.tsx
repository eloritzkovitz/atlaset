import { useTranslation } from "react-i18next";
import { STATUS_COLOR_CLASSES } from "@constants/colors";
import { ICONS } from "@constants/icons";
import type { CategorizedVisits } from "@features/visits/types";
import { VisitSection } from "./VisitSection";

interface CountryVisitsContentProps {
  visits: CategorizedVisits;
  onTripClick?: (tripId: string) => void;
}

export function CountryVisitsContent({
  visits,
  onTripClick,
}: CountryVisitsContentProps) {
  const { t } = useTranslation("atlas");

  const handleVisitChipClick = (tripId: string | undefined) => {
    if (tripId) {
      onTripClick?.(tripId);
    }
  };

  return (
    <div>
      <VisitSection
        icon={<ICONS.tripPlanned />}
        title={t("countries.details.visits.planned")}
        count={visits.tentative.length}
        visits={visits.tentative}
        badgeColorClass={STATUS_COLOR_CLASSES.planned}
      />

      <VisitSection
        icon={<ICONS.tripUpcoming />}
        title={t("countries.details.visits.upcoming")}
        count={visits.upcoming.length}
        visits={visits.upcoming}
        badgeColorClass={STATUS_COLOR_CLASSES.upcoming}
        onVisitClick={handleVisitChipClick}
      />

      <VisitSection
        icon={<ICONS.tripCompleted />}
        title={t("countries.details.visits.completed")}
        count={visits.past.length}
        visits={visits.past}
        badgeColorClass={STATUS_COLOR_CLASSES.completed}
        onVisitClick={handleVisitChipClick}
      />
    </div>
  );
}
