import type { MouseEvent } from "react";
import type { Country } from "./country";

/** Props for components that allow selecting and hovering countries. */
export interface CountryInteractionProps {
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onSelect: (isoCode: string | null, event?: MouseEvent) => void;
  onHover: (isoCode: string | null) => void;
}

/** Props for components that allow navigating to a country. */
export interface CountryNavigationProps {
  onSelectCountry?: (isoCode: string) => void;
}

/** Props for components that display information about a country. */
export interface CountryInfoProps {
  onCountryInfo?: (country: Country) => void;
}

/** Props for components that have a context menu for each country. */
export interface CountryContextMenuProps {
  onContextMenu?: (event: MouseEvent, country: Country) => void;
}
