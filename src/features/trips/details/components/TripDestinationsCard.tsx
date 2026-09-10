import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@components";
import type { Location } from "@lib/locations";
import { TripLocationsList } from "../../core/components/TripLocationsList";
import { TripLocationsMap } from "./TripLocationsMap";

interface TripDestinationsCardProps {
  locations: Location[];
  loading?: boolean;
}

export function TripDestinationsCard({
  locations,
  loading = false,
}: TripDestinationsCardProps) {
  const { t } = useTranslation("trips");

  const [selectedLocationId, setSelectedLocationId] = useState<
    number | undefined
  >();

  return (
    <Card title={t("sections.destinations", "Destinations")}>
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <div className="min-w-0 lg:min-h-0">
          <div className="max-h-[420px] overflow-y-auto pe-2 lg:h-[420px]">
            <TripLocationsList
              locations={locations}
              loading={loading}
              selectedLocationId={selectedLocationId}
              onLocationClick={(location) => {
                setSelectedLocationId(location.id);
              }}
            />
          </div>
        </div>

        <div className="min-w-0">
          <TripLocationsMap
            locations={locations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={setSelectedLocationId}
          />
        </div>
      </div>
    </Card>
  );
}
