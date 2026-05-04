import { FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { CountryWithFlag } from "@features/countries";

interface SelectedCountriesListProps {
  selectedCountries: {
    isoCode: string;
    name: string;
  }[];
  onRemove: (isoCode: string) => void;
}

export function SelectedCountriesList({
  selectedCountries,
  onRemove,
}: SelectedCountriesListProps) {
  const { t } = useTranslation("trips");
  
  return (
    <div>
      <div className="flex flex-col gap-2">
        {selectedCountries.length === 0 && (
          <EmptyListMessage message={t("modal.form.noCountriesSelected")} />
        )}
        {selectedCountries.map((country) => (
          <span
            key={country.isoCode}
            className="flex items-center gap-1 px-2 py-1 bg-surface-alt rounded-lg"
          >
            <CountryWithFlag isoCode={country.isoCode} name={country.name} />
            <button
              type="button"
              className="ms-auto text-muted hover:text-muted-hover"
              title={t("modal.actions.removeCountry")}
              aria-label={t("modal.actions.removeCountry")}
              onClick={() => onRemove(country.isoCode)}
            >
              <FaXmark />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
