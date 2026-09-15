import { useTranslation } from "react-i18next";
import { FieldHeader } from "@components";
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
      <FieldHeader
        label={t("fields.countries")}
        onEdit={onEdit}
        editLabel={t("editor.overview.countries.select")}
      />

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
