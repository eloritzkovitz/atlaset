import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
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
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold">
          {t("editor.destinations.locations.title")}
        </span>

        <ActionButton
          icon={<ICONS.editField />}
          title={t("editor.destinations.locations.select")}
          ariaLabel={t("editor.destinations.locations.select")}
          onClick={onEdit}
          rounded
        />
      </div>

      <TripLocationsList
        locations={locations}
        loading={loading}
        onRemove={onRemove}
      />
    </div>
  );
}
