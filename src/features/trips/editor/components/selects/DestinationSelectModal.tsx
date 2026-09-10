import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalSelect } from "@components";
import { ICONS } from "@constants/icons";
import type { Location } from "@lib/locations";
import { useLocationSearch } from "../../../core/hooks/useLocationSearch";

interface DestinationSelectModalProps {
  isOpen: boolean;
  selected: number[];
  countryCodes: string[];
  onChange: (locationIds: number[]) => void;
  onClose: () => void;
}

/** Renders the destination selection modal for a trip. */
export function DestinationSelectModal({
  isOpen,
  selected,
  countryCodes,
  onChange,
  onClose,
}: DestinationSelectModalProps) {
  const { t, i18n } = useTranslation("trips");
  const [search, setSearch] = useState("");

  const { locations, loading } = useLocationSearch({
    isOpen,
    search,
    countryCodes,
    language: i18n.language,
  });

  return (
    <ModalSelect<Location>
      isOpen={isOpen}
      title={
        <>
          <ICONS.location />
          {t("editor.destinations.locations.select")}
        </>
      }
      items={locations}
      selectedValues={selected.map(String)}
      searchValue={search}
      onSearchChange={setSearch}
      getItemValue={(location) => String(location.id)}
      getItemSearchLabel={(location) => location.name}
      placeholder={t("editor.destinations.locations.searchPlaceholder")}
      emptyMessage={
        loading
          ? t("common:components.search.searching")
          : t("editor.destinations.locations.noResults")
      }
      multiple
      onChange={(values) => {
        onChange(values.map(Number));
      }}
      onClose={onClose}
      renderItem={(location) => (
        <div className="flex flex-col">
          <span>{location.name}</span>

          {location.admin1 && (
            <span className="text-sm text-muted">{location.admin1.name}</span>
          )}
        </div>
      )}
    />
  );
}
