import type { MouseEvent } from "react";

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
