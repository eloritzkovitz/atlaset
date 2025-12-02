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
    <div className="flex flex-col w-[250px] border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <div className="font-semibold mb-2 text-gray-700 dark:text-gray-200">
        Selected Countries
      </div>
      <div className="flex flex-col gap-2">
        {selectedCountries.length === 0 && (
          <span className="text-gray-400 text-sm">No countries selected</span>
        )}
        {selectedCountries.map((country) => (
          <span
            key={country.isoCode}
            className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
          >
            <CountryWithFlag isoCode={country.isoCode} name={country.name} />
            <button
              type="button"
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
