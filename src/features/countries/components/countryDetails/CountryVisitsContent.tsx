import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import type { CategorizedVisits } from "@features/visits/types";
import { VisitSection } from "./VisitSection";

interface CountryVisitsContentProps {
  visits: CategorizedVisits;
}

export function CountryVisitsContent({ visits }: CountryVisitsContentProps) {
  const { trips } = useTrips();
  const { handleViewInCalendar } = useUI();
  const { t } = useTranslation("atlas");

  // Handler for clicking on a visit chip
  const handleVisitChipClick = (tripId: string | undefined) => {
    if (!tripId) return;
    const trip = trips.find((t) => t.id === tripId);
    if (trip) handleViewInCalendar(trip);
  };

  return (
    <div>
      <VisitSection
        icon={<ICONS.tripPlanned />}
        title={t("countries.details.visits.planned")}
        count={visits.tentative.length}
        visits={visits.tentative}
        status="planned"
      />
      <VisitSection
        icon={<ICONS.tripUpcoming />}
        title={t("countries.details.visits.upcoming")}
        count={visits.upcoming.length}
        visits={visits.upcoming}
        status="upcoming"
        onVisitClick={handleVisitChipClick}
      />
      <VisitSection
        icon={<ICONS.tripCompleted />}
        title={t("countries.details.visits.completed")}
        count={visits.past.length}
        visits={visits.past}
        status="completed"
        onVisitClick={handleVisitChipClick}
      />
    </div>
  );
}
