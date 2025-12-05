import { CountryFlag } from "@features/countries/components/countryFlag/CountryFlag";
import type { Country } from "@types";

interface CountryDisplayProps {
  countries: Country[];
  visitedCountryCodes: string[];
  view?: "grid" | "list";
}

export function CountryDisplay({
  countries,
  visitedCountryCodes,
  view = "grid",
}: CountryDisplayProps) {
  if (view === "list") {
    return (
      <ul className="p-2">
        {countries.map((c) => {
          const isVisited = visitedCountryCodes.includes(c.isoCode);
          return (
            <li
              key={c.isoCode}
              className={`flex items-center gap-3 py-2 px-2 rounded-lg ${
                isVisited ? "" : "opacity-50"
              }`}
              title={c.name}
            >
              <CountryFlag
                flag={{
                  isoCode: c.isoCode,
                  source: "flagcdn",
                  style: "flat",
                  size: "64",
                }}
                alt={c.name}
                className="shadow"
              />
              <span className="text-sm">{c.name}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  // Default: grid view
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
      {countries.map((c) => {
        const isVisited = visitedCountryCodes.includes(c.isoCode);
        return (
          <div
            key={c.isoCode}
            className={`flex flex-col items-center justify-center p-2 rounded-lg ${
              isVisited ? "" : "opacity-50"
            }`}
            title={c.name}
          >
            <CountryFlag
              flag={{
                isoCode: c.isoCode,
                source: "flagcdn",
                style: "flat",
                size: "128",
              }}
              alt={c.name}
              className="mb-2 shadow"
            />
            <span className="text-xs text-center break-words">{c.name}</span>
          </div>
        );
      })}
    </div>
  );
}
