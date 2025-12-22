import { Card } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountryFlag } from "@features/countries";
import { useVisitedCountries } from "@features/visits";

export function VisitedCountriesCard() {
  const { countries } = useCountryData();
  const { visitedCountryCodes } = useVisitedCountries();
  const visitedCountries = countries.filter((c) =>
    visitedCountryCodes.includes(c.isoCode)
  );

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold mb-8">
        Visited Countries ({visitedCountries.length})
      </h2>
      {visitedCountries.length === 0 ? (
        <div className="text-muted">No countries visited yet.</div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-10 gap-2">
          {visitedCountries.map((c) => (
            <li key={c.isoCode} className="flex items-center justify-center">
              <CountryFlag
                flag={{
                  isoCode: c.isoCode,
                  source: "svg",
                  size: "64",
                  style: "flat",
                }}
                alt={c.name}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
