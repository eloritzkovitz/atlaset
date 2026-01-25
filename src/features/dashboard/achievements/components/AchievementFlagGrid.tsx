import { CountryFlag } from "@features/countries";
import "./AchievementFlagGrid.css";
import type { Flag } from "@features/countries/types/flag";
import type { Country } from "@features/countries";
import { Tooltip } from "@components/ui/Tooltip/Tooltip";

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
      className="grid mb-2"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(36px, 1fr))`,
        gap: 8,
        justifyItems: "center",
        alignItems: "center",
        maxWidth: 220,
        margin: "0 auto",
      }}
    >
      {countryCodes.map((isoCode: string) => {
        const country = countries.find((c) => c.isoCode === isoCode);
        if (!country) return null;
        const flag: Flag = {
          isoCode: country.isoCode,
          ratio: "fourThree",
          size: "32",
        };
        const visitedFlag = visited.isCountryVisited(country.isoCode);
        return (
          <Tooltip content={country.name} position="bottom">
            <span
              key={isoCode}
              style={{
                opacity: visitedFlag ? 1 : 0.4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 36,
                height: 28,
              }}
              className={visitedFlag ? undefined : "flag-grayscale-hover"}
            >
              <CountryFlag flag={flag} />
            </span>
          </Tooltip>
        );
      })}
    </div>
  );
}
