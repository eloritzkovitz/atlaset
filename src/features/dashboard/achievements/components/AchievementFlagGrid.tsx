import { Tooltip } from "@components";
import { CountryFlag, type Country } from "@features/countries";
import type { Flag } from "@features/countries/types/flag";
import "./AchievementFlagGrid.css";

interface AchievementFlagGridProps {
  countries: Country[];
  countryCodes: string[];
  visited: { isVisitedCountry: (iso: string) => boolean };
}

export function AchievementFlagGrid({
  countries,
  countryCodes,
  visited,
}: AchievementFlagGridProps) {
  // Map isoCodes to country objects, filter out missing, then sort by name
  const sortedCountries = countryCodes
    .map((isoCode) => countries.find((c) => c.isoCode === isoCode))
    .filter((c): c is Country => !!c)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div
      className="grid gap-2 justify-items-center items-center max-w-xs mx-auto mb-2"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(36px, 1fr))` }}
    >
      {sortedCountries.map((country) => {
        const flag: Flag = {
          isoCode: country.isoCode,
          sovereignState: country.sovereignState,
          ratio: "3x2",
          size: "32",
        };
        const visitedFlag = visited.isVisitedCountry(country.isoCode);

        return (
          <Tooltip
            content={country.name}
            position="bottom"
            key={country.isoCode}
          >
            <span
              style={{
                opacity: visitedFlag ? 1 : 0.4,
              }}
              className={`${visitedFlag ? "" : "flag-grayscale-hover"} flex justify-center items-center w-9 h-7`}
            >
              <CountryFlag flag={flag} />
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
}
