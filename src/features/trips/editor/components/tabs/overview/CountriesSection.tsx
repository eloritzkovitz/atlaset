import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { getCountrySortName } from "@features/countries";
import { TripCountriesList } from "@features/trips/core/components/TripCountriesList";

interface CountriesSectionProps {
  selectedCountries: { isoCode: string; name: string }[];
  onEdit: () => void;
  onRemove: (isoCode: string) => void;
}

export function CountriesSection({
  selectedCountries,
  onEdit,
  onRemove,
}: CountriesSectionProps) {
  const { t } = useTranslation("trips");

  const sortedCountries = [...selectedCountries].sort((a, b) =>
    getCountrySortName(a).localeCompare(getCountrySortName(b)),
  );

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-text">{t("fields.countries")}</span>

        <ActionButton
          type="button"
          onClick={onEdit}
          icon={<ICONS.editField />}
          title={t("editor.overview.countries.select")}
          aria-label={t("editor.overview.countries.select")}
          rounded
        />
      </div>

      <div className="grid grid-cols-[120px_1fr] gap-2">
        <div />
        <TripCountriesList
          countries={sortedCountries}
          removable
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}
