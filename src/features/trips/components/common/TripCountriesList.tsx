import { FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { CountryWithFlag } from "@features/countries";

interface TripCountriesListProps {
  countries: {
    isoCode: string;
    name: string;
  }[];
  removable?: boolean;
  onRemove?: (isoCode: string) => void;
}

export function TripCountriesList({
  countries,
  onRemove,
  removable = false,
}: TripCountriesListProps) {
  const { t } = useTranslation("trips");

  return (
    <div>
      <div className="flex flex-col gap-3">
        {countries.length === 0 && (
          <EmptyListMessage message={t("modal.form.noCountriesSelected")} />
        )}
        {countries.map((country) => (
          <span key={country.isoCode} className="flex items-center py-0.5">
            <CountryWithFlag isoCode={country.isoCode} name={country.name} />
            {removable && (
              <button
                type="button"
                className="ms-auto text-muted hover:text-muted-hover"
                aria-label={t("modal.actions.removeCountry")}
                onClick={() => onRemove && onRemove(country.isoCode)}
              >
                <FaXmark />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
