/** Represents a single entry in the map legend */
export interface LegendItem {
  /** The color associated with the legend item */
  color: string;
  /** The label or description for the legend item */
  label: string;
  /** Optional icon to represent the legend item */
  icon?: React.ReactNode;
}
