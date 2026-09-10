import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { TripLocationsList } from "@features/trips/core/components/TripLocationsList";
import type { Location } from "@lib/locations";

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
          icon={<ICONS.edit />}
          variant="custom"
          className="px-2 py-1 text-sm"
          ariaLabel={t("editor.destinations.locations.select")}
          onClick={onEdit}
        >
          {locations.length > 0
            ? t("editor.actions.edit")
            : t("editor.actions.add")}
        </ActionButton>
      </div>

      <TripLocationsList
        locations={locations}
        loading={loading}
        onRemove={onRemove}
      />
    </div>
  );
}
