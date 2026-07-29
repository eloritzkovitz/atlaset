/**
 * Utility functions for styling map features based on their properties and state.
 */

interface ResolveStyleArgs {
  geographyStyle: Record<string, React.CSSProperties>;
  isHighlighted: boolean;
  isHovered: boolean;
  isSelected: boolean;
  isAtlasActive: boolean;
  atlasColor?: string;
  blendedFill?: string | null;
  isAddingMarker?: boolean;
}

/**
 * Resolves the style for a country based on its state and the provided geography style.
 * @param geographyStyle - The base styles for the geography features.
 * @param isHighlighted - Whether the country is highlighted.
 * @param isHovered - Whether the country is hovered.
 * @param isSelected - Whether the country is selected.
 * @param isAtlasActive - Whether the atlas mode is active.
 * @param atlasColor - The color to use when the atlas mode is active.
 * @param blendedFill - The blended fill color to use if provided.
 * @param isAddingMarker - Whether the user is currently adding a marker.
 * @returns The resolved style for the country.
 */
export function resolveCountryStyle({
  geographyStyle,
  isHighlighted,
  isHovered,
  isSelected,
  isAtlasActive,
  atlasColor,
  blendedFill,
  isAddingMarker,
}: ResolveStyleArgs) {
  let fill = geographyStyle.default.fill;

  if (isHighlighted) {
    fill = geographyStyle.highlight.fill;
  } else if (isHovered || isSelected) {
    fill = geographyStyle.hover.fill;
  } else if (isAtlasActive) {
    fill = atlasColor || geographyStyle.default.fill;
  } else if (blendedFill) {
    fill = blendedFill;
  }

  // Determine cursor based on whether user is in marker creation mode
  const cursor = isAddingMarker ? "crosshair" : "pointer";

  return { ...geographyStyle.default, fill, cursor };
}
