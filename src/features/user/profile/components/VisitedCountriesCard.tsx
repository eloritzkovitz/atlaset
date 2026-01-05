import { Card } from "@components";
import { CountryFlag, useCountryData } from "@features/countries";

interface VisitedCountriesCardProps {
  visitedCountryCodes: string[];
}

export function VisitedCountriesCard({ visitedCountryCodes }: VisitedCountriesCardProps) {
  const { countries } = useCountryData();
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
                  ratio: "fourThree",
                  size: "64",
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
