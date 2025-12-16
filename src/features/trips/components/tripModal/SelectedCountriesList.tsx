import { FaXmark } from "react-icons/fa6";
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
  return (
    <div>
      <div className="font-semibold mb-2">Selected Countries</div>
      <div className="flex flex-col gap-2">
        {selectedCountries.length === 0 && (
          <span className="text-muted text-sm">No countries selected</span>
        )}
        {selectedCountries.map((country) => (
          <span
            key={country.isoCode}
            className="flex items-center gap-1 px-2 py-1 bg-surface-alt rounded-lg"
          >
            <CountryWithFlag isoCode={country.isoCode} name={country.name} />
            <button
              type="button"
              className="ml-auto text-muted hover:text-muted-hover"
              title="Remove"
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
