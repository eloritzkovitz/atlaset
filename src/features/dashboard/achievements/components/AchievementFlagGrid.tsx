import { Tooltip } from "@components";
import { CountryFlag, type Country } from "@features/countries";
import type { Flag } from "@features/countries/types/flag";
import "./AchievementFlagGrid.css";

interface AchievementFlagGridProps {
  countries: Country[];
  countryCodes: string[];
  visited: { isCountryVisited: (iso: string) => boolean };
}

export function AchievementFlagGrid({
  countries,
  countryCodes,
  visited,
}: AchievementFlagGridProps) {
  return (
    <div
      className="grid gap-2 justify-items-center items-center max-w-xs mx-auto mb-2"
      style={{ gridTemplateColumns: `repeat(5, minmax(36px, 1fr))` }}
    >
      {countryCodes.map((isoCode: string) => {
        const country = countries.find((c) => c.isoCode === isoCode);

        // If country not found, skip rendering
        if (!country) return null;

        // Prepare flag props
        const flag: Flag = {
          isoCode: country.isoCode,
          ratio: "fourThree",
          size: "32",
        };
        const visitedFlag = visited.isCountryVisited(country.isoCode);

        return (
          <Tooltip content={country.name} position="bottom" key={isoCode}>
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
