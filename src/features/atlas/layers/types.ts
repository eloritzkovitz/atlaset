/** Represents a layer on the atlas map. */
export type Layer = {
  /** Unique identifier for the layer. */
  id: string;
  /** Name of the layer. */
  name: string;
  /** Color associated with the layer. */
  color: string;
  /** List of country codes included in the layer. */
  countries: string[];  
  /** Optional custom labels for filter options. */
  filterLabels?: {
    all?: string;
    only?: string;
    exclude?: string;
  };
  /** Whether the layer is visible on the map. */
  visible: boolean;
  /** Optional display order for the layer. */
  order?: number;
};

/** Represents a timeline-enabled layer on the atlas map. */
export type TimelineLayer = Layer & {
  /** Indicates that the layer supports timeline features. */
  timelineEnabled: true;
  /** Optional snapshot mode for the timeline layer. */
  timelineSnapshot?: boolean;
};

/** Union type for any layer, either standard or timeline-enabled. */
export type AnyLayer = Layer | TimelineLayer;

/** Represents an item to be displayed on the atlas map as part of a layer. */
export type LayerItem = {
  isoCode: string;
  color?: string;
  layerId: string;
  style?: React.CSSProperties;
};

/** Modes for displaying layers on the atlas map. */
export type LayerMode = "standard" | "cumulative" | "yearly";
