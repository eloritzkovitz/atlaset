import { useTranslation } from "react-i18next";
import { FieldHeader } from "@components";
import type { Location } from "@lib/locations";
import { TripLocationsList } from "../../../../locations/components/TripLocationsList";

interface LocationsSectionProps {
  locations: Location[];
  loading: boolean;
  onEdit: () => void;
  onRemove: (locationId: number) => void;
}

/** Renders the selected locations section for a trip. */
export function LocationsSection({
  locations,
  loading,
  onEdit,
  onRemove,
}: LocationsSectionProps) {
  const { t } = useTranslation("trips");

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <FieldHeader
        label={t("editor.destinations.locations.title")}
        onEdit={onEdit}
        editLabel={t("editor.destinations.locations.select")}
      />

      <TripLocationsList
        locations={locations}
        loading={loading}
        onRemove={onRemove}
      />
    </div>
  );
}
