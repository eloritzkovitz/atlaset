import type { ViewMode } from "@types";
import { CountryDisplay } from "./CountryDisplay";
import { CountryListRow } from "./CountryListRow";
import type { FlagRatio, FlagSize } from "../../flags/types";
import type { Country } from "../../types";

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
  onContextMenu?: (event: React.MouseEvent, country: Country) => void;
  view: ViewMode;
}

export function CountryItem({
  country,
  visitedCountryCodes = [],
  showAllAsVisited = false,
  selectedIsoCode,
  hoveredIsoCode,
  showFlags = true,
  flagRatio,
  flagSize,
  showBadges,
  renderBadge,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  view,
}: CountryItemProps) {
  // Determine if the country is visited or highlighted based on the provided props
  const isVisited =
    showAllAsVisited || visitedCountryCodes.includes(country.isoCode);
  const isHighlighted =
    country.isoCode === hoveredIsoCode || country.isoCode === selectedIsoCode;

  if (view === "list") {
    return (
      <CountryListRow
        country={country}
        tone={isVisited ? "visited" : "dimmed-colored"}
        className={`px-2 sm:px-4 rounded cursor-pointer flex items-center sm:gap-3 transition`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onContextMenu={onContextMenu}
        showBadges={showBadges}
        renderBadge={renderBadge}
      />
    );
  }

  return (
    <div
      key={country.isoCode}
      id={country.isoCode}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={(event) => onContextMenu?.(event, country)}
      className={`group flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg cursor-pointer transition
        ${isHighlighted ? "bg-blue-50 dark:bg-gray-500 font-bold" : ""}
        ${!isVisited ? "opacity-50" : ""}
      `}
    >
      {showFlags ? (
        <CountryDisplay
          country={country}
          flagRatio={flagRatio}
          flagSize={flagSize}
          hoverable={true}
        />
      ) : (
        <span className="text-xs sm:text-sm">{country.name}</span>
      )}
    </div>
  );
}
