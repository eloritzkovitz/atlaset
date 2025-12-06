import type { Country } from "@types";
import { CountryFlag } from "../countryFlag/CountryFlag";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import type { FlagSize } from "../../types/flag";

interface CountryItemProps {
  country: Country;
  visitedCountryCodes?: string[];
  showAllAsVisited?: boolean;
  selectedIsoCode?: string | null;
  hoveredIsoCode?: string | null;
  showFlags: boolean;
  flagSource?: "svg" | "flagcdn";
  flagSize?: FlagSize;
  showBadges: boolean;
  renderBadge?: (country: Country) => React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  view: "grid" | "list";
}

export function CountryItem({
  country,
  visitedCountryCodes = [],
  showAllAsVisited = false,
  selectedIsoCode,
  hoveredIsoCode,
  showFlags,
  flagSource,
  flagSize,
  showBadges,
  renderBadge,
  onClick,
  onMouseEnter,
  onMouseLeave,
  view,
}: CountryItemProps) {
  const isVisited =
    showAllAsVisited || visitedCountryCodes.includes(country.isoCode);
  const isHighlighted =
    country.isoCode === hoveredIsoCode || country.isoCode === selectedIsoCode;

  const baseClass =
    view === "list"
      ? `px-4 py-2 my-1 rounded cursor-pointer flex items-center gap-3 transition`
      : `flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition`;

  return (
    <div
      key={country.isoCode}
      id={country.isoCode}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${baseClass}
        ${isHighlighted ? "bg-blue-50 dark:bg-gray-500 font-bold" : ""}
        ${!isVisited ? "opacity-50" : ""}
      `}
      title={country.name}
    >
      {showFlags ? (
        view === "list" ? (
          <CountryWithFlag isoCode={country.isoCode} name={country.name} />
        ) : (
          <CountryFlag
            flag={{
              isoCode: country.isoCode,
              source: flagSource || "svg",
              style: "flat",
              size: flagSize || "64",
            }}
            alt={country.name}
            className="mb-2 shadow"
          />
        )
      ) : (
        <span className="text-sm">{country.name}</span>
      )}
      {view === "grid" && (
        <span className="text-base text-center break-words">
          {country.name}
        </span>
      )}
      {showBadges && renderBadge && renderBadge(country)}
    </div>
  );
}
