import { CountryFlag } from "../countryFlag/CountryFlag";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import type { Country } from "../../types";
import type { FlagRatio, FlagSize } from "../../types/flag";

interface CountryItemProps {
  country: Country;
  visitedCountryCodes?: string[];
  showAllAsVisited?: boolean;
  selectedIsoCode?: string | null;
  hoveredIsoCode?: string | null;
  showFlags: boolean;
  flagRatio?: FlagRatio;
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
  flagRatio,
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
      ? `px-2 sm:px-4 py-2 my-1 rounded cursor-pointer flex items-center gap-2 sm:gap-3 transition`
      : `flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg cursor-pointer transition`;

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
          <CountryWithFlag
            isoCode={country.isoCode}
            name={country.name}
            className="text-sm sm:text-base"
          />
        ) : (
          <div className="flex flex-col items-center w-[128px] h-[140px]">
            <div className="flex items-center justify-center w-[128px] h-[96px]">
              <CountryFlag
                flag={{
                  isoCode: country.isoCode,
                  ratio: flagRatio || "original",
                  size: flagSize || (window.innerWidth < 640 ? "32" : "64"),
                }}
                alt={country.name}
                className="shadow max-w-full max-h-full object-contain"
              />
            </div>
            <span className="block mt-1 text-xs sm:text-base text-center break-words min-h-[20px]">
              {country.name}
            </span>
          </div>
        )
      ) : (
        <span className="text-xs sm:text-sm">{country.name}</span>
      )}
      {view === "list" && !showFlags && (
        <span className="text-xs sm:text-base text-center break-words">
          {country.name}
        </span>
      )}
      {showBadges && renderBadge && renderBadge(country)}
    </div>
  );
}
