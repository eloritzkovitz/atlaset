import { CountryWithFlag } from "@features/countries/components/countryFlag/CountryWithFlag";
import type { Country } from "@types";

interface SubregionCountryListProps {
  countries: Country[];
  visitedCountryCodes: string[];
}

export function SubregionCountryList({
  countries,
  visitedCountryCodes,
}: SubregionCountryListProps) {
  return (
    <ul>
      {countries.map((c) => {
        const isVisited = visitedCountryCodes.includes(c.isoCode);
        return (
          <li
            key={c.isoCode}
            className={`flex items-center gap-2 py-1 ${
              isVisited ? "" : "text-gray-400 opacity-60"
            }`}
          >
            <CountryWithFlag isoCode={c.isoCode} name={c.name} />
          </li>
        );
      })}
    </ul>
  );
}
