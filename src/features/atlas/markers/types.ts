/**
 * Represents a marker on the atlas map.
 */
export type Marker = {
  /** Unique identifier for the marker */
  id: string;
  /** Name of the marker */
  name: string;
  /** Latitude coordinate of the marker */
  latitude: number;
  /** Longitude coordinate of the marker */
  longitude: number;
  /** Color associated with the marker */
  color?: string;
  /** Description or additional information about the marker */
  description?: string;
  /** Visibility status of the marker */
  visible: boolean;
};
