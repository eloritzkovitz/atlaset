import React from "react";
import { CountryItem } from "./CountryItem";
import type { Country } from "../../types";

interface CountryDisplayPanelProps {
  countries: Country[];
  visitedCountryCodes?: string[];
  showAllAsVisited?: boolean;
  view?: "grid" | "list";
  selectedIsoCode?: string | null;
  hoveredIsoCode?: string | null;
  onSelect?: (isoCode: string | null) => void;
  onHover?: (isoCode: string | null) => void;
  onCountryInfo?: (country: Country) => void;
  renderBadge?: (country: Country) => React.ReactNode;
  showFlags?: boolean;
  showBadges?: boolean;
  className?: string;
}

export const CountryDisplayPanel = React.forwardRef<
  HTMLDivElement,
  CountryDisplayPanelProps
>(
  (
    {
      countries,
      visitedCountryCodes = [],
      showAllAsVisited = false,
      view = "grid",
      selectedIsoCode,
      hoveredIsoCode,
      onSelect,
      onHover,
      onCountryInfo,
      renderBadge,
      showFlags = true,
      showBadges = false,
      className = "",
    },
    ref
  ) => {
    // List view
    if (view === "list") {
      return (
        <div ref={ref} className={`w-full ${className}`}>
          <ul className="list-none p-0 m-0 w-full">
            {countries.length === 0 ? (
              <li className="px-4 py-8 text-center text-muted">
                No countries found
              </li>
            ) : (
              countries.map((country) => (
                <li key={country.isoCode}>
                  <CountryItem
                    country={country}
                    visitedCountryCodes={visitedCountryCodes}
                    showAllAsVisited={showAllAsVisited}
                    selectedIsoCode={selectedIsoCode}
                    hoveredIsoCode={hoveredIsoCode}
                    showFlags={showFlags}
                    showBadges={showBadges}
                    renderBadge={renderBadge}
                    onClick={() =>
                      onCountryInfo
                        ? onCountryInfo(country)
                        : onSelect?.(country.isoCode)
                    }
                    onMouseEnter={() => onHover?.(country.isoCode)}
                    onMouseLeave={() => onHover?.(null)}
                    view="list"
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      );
    }

    // Grid view
    return (
      <div
        ref={ref}
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2 ${className}`}
      >
        {countries.length === 0 ? (
          <div className="col-span-full text-center text-muted py-8">
            No countries found
          </div>
        ) : (
          countries.map((country) => (
            <CountryItem
              key={country.isoCode}
              country={country}
              visitedCountryCodes={visitedCountryCodes}
              showAllAsVisited={showAllAsVisited}
              selectedIsoCode={selectedIsoCode}
              hoveredIsoCode={hoveredIsoCode}
              showFlags={showFlags}             
              flagSize="128"
              showBadges={showBadges}
              renderBadge={renderBadge}
              onClick={() =>
                onCountryInfo
                  ? onCountryInfo(country)
                  : onSelect?.(country.isoCode)
              }
              onMouseEnter={() => onHover?.(country.isoCode)}
              onMouseLeave={() => onHover?.(null)}
              view="grid"
            />
          ))
        )}
      </div>
    );
  }
);
