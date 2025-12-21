/**
 * Represents an overlay on the atlas map.
 */
export type Overlay = {
  /** Unique identifier for the overlay. */
  id: string;
  /** Name of the overlay. */
  name: string;
  /** Color associated with the overlay. */
  color: string;
  /** List of country codes included in the overlay. */
  countries: string[];
  /** Optional tooltip text for the overlay. */
  tooltip?: string;
  /** Whether the overlay is visible on the map. */
  visible: boolean;
  /** Optional display order for the overlay. */
  order?: number;
};

/**
 * Represents a timeline-enabled overlay on the atlas map.
 */
export type TimelineOverlay = Overlay & {
  /** Indicates that the overlay supports timeline features. */
  timelineEnabled: true;
  /** Optional snapshot mode for the timeline overlay. */
  timelineSnapshot?: boolean;
};

/**
 * Union type for any overlay, either standard or timeline-enabled.
 */
export type AnyOverlay = Overlay | TimelineOverlay;

/**
 * Represents an item to be displayed on the atlas map as part of an overlay.
 */
export type OverlayItem = {
  isoCode: string;
  color?: string;
  overlayId: string;
  tooltip?: string;
  style?: React.CSSProperties;
};

/**
 * Modes for displaying overlays on the atlas map.
 */
export type OverlayMode = "standard" | "cumulative" | "yearly";
