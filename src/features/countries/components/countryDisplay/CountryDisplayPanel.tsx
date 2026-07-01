import React from "react";
import { EmptyListMessage } from "@components";
import type { ViewMode } from "@types";
import { CountryItem } from "./CountryItem";
import type { Country } from "../../types";

interface CountryDisplayPanelProps {
  countries: Country[];
  visitedCountryCodes?: string[];
  showAllAsVisited?: boolean;
  view?: ViewMode;
  selectedIsoCode?: string | null;
  hoveredIsoCode?: string | null;
  onSelect?: (isoCode: string | null) => void;
  onHover?: (isoCode: string | null) => void;
  onCountryInfo?: (country: Country) => void;
  onContextMenu?: (event: React.MouseEvent, country: Country) => void;
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
      onContextMenu,
      renderBadge,
      showFlags = true,
      showBadges = false,
      className = "",
    },
    ref,
  ) => {
    // Handle country info click, either calling the provided callback or selecting the country
    const handleCountryInfo = (country: Country) => {
      if (onCountryInfo) {
        onCountryInfo(country);
      } else {
        onSelect?.(country.isoCode);
      }
    };

    // Render a single country item based on the view mode
    const renderCountryItem = (country: Country, itemView: ViewMode) => (
      <CountryItem
        key={country.isoCode}
        country={country}
        visitedCountryCodes={visitedCountryCodes}
        showAllAsVisited={showAllAsVisited}
        selectedIsoCode={selectedIsoCode}
        hoveredIsoCode={hoveredIsoCode}
        showFlags={showFlags}
        showBadges={showBadges}
        renderBadge={renderBadge}
        onClick={() => handleCountryInfo(country)}
        onMouseEnter={() => onHover?.(country.isoCode)}
        onMouseLeave={() => onHover?.(null)}
        view={itemView}
        onContextMenu={onContextMenu}
        flagSize={itemView === "grid" ? "128" : undefined}
      />
    );

    // Render country items based on the current view mode (list or grid)
    const renderCountryItems = (itemView: ViewMode) =>
      countries.map((country) =>
        itemView === "list" ? (
          <li key={country.isoCode}>{renderCountryItem(country, itemView)}</li>
        ) : (
          renderCountryItem(country, itemView)
        ),
      );

    if (view === "list") {
      return (
        <div ref={ref} className={`w-full ${className}`}>
          <ul className="list-none p-0 m-0 w-full">
            {countries.length === 0 ? (
              <EmptyListMessage message="No countries found." />
            ) : (
              renderCountryItems("list")
            )}
          </ul>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2 ${className}`}
      >
        {countries.length === 0 ? (
          <div className="col-span-full py-8">
            <EmptyListMessage message="No countries found." />
          </div>
        ) : (
          renderCountryItems("grid")
        )}
      </div>
    );
  },
);

CountryDisplayPanel.displayName = "CountryDisplayPanel";
