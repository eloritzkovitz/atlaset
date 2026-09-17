import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage } from "@components";
import { ICONS } from "@constants/icons";
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
          <EmptyListMessage message={t("editor.overview.countries.none")} />
        )}

        {countries.map((country) =>
          removable ? (
            <div
              key={country.isoCode}
              className="flex items-center justify-between rounded-full bg-input px-3 py-2 transition-colors hover:bg-primary-hover/35"
            >
              <CountryWithFlag country={country} />

              <ActionButton
                icon={<ICONS.close />}
                title={t("editor.actions.remove")}
                ariaLabel={t("editor.actions.remove")}
                onClick={() => onRemove?.(country.isoCode)}
                className="p-1"
                rounded
              />
            </div>
          ) : (
            <span key={country.isoCode} className="flex items-center py-0.5">
              <CountryWithFlag country={country} />
            </span>
          ),
        )}
      </div>
    </div>
  );
}
