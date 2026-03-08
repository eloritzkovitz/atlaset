import { ICONS } from "@constants/icons";
import { VisitSection } from "./VisitSection";
import type { Visit } from "@features/visits";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";

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
        title={`Planned (${visits.tentative.length})`}
        visits={visits.tentative}
      />
      <VisitSection
        icon={<ICONS.tripUpcoming />}
        title={`Upcoming (${visits.upcoming.length})`}
        visits={visits.upcoming}
        onVisitClick={handleVisitChipClick}
      />
      <VisitSection
        icon={<ICONS.tripCompleted />}
        title={`Completed (${visits.past.length})`}
        visits={visits.past}
        onVisitClick={handleVisitChipClick}
      />
    </div>
  );
}
