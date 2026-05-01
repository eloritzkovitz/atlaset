import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import type { Visit } from "@features/visits";
import { VisitSection } from "./VisitSection";

interface CountryVisitsContentProps {
  visits: {
    past: Visit[];
    upcoming: Visit[];
    tentative: Visit[];
  };
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
        title={t("country.visits.planned")}
        count={visits.tentative.length}
        visits={visits.tentative}
      />
      <VisitSection
        icon={<ICONS.tripUpcoming />}
        title={t("country.visits.upcoming")}
        count={visits.upcoming.length}
        visits={visits.upcoming}
        onVisitClick={handleVisitChipClick}
      />
      <VisitSection
        icon={<ICONS.tripCompleted />}
        title={t("country.visits.completed")}
        count={visits.past.length}
        visits={visits.past}
        onVisitClick={handleVisitChipClick}
      />
    </div>
  );
}
