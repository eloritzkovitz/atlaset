/** Represents a marker on the atlas map. */
export type Marker = {
  /** Unique identifier for the marker. */
  id: string;  
  /** Name of the marker. */
  name: string;
  /** ISO 3166-1 alpha-2 code of the target country. */
  isoCode: string;
  /** Color associated with the marker. */
  color: string;
  /** Notes or additional information about the marker. */
  notes?: string;
  /** Visibility status of the marker. */
  visible: boolean;
  /** Optional display order for the marker. */
  order?: number;
};
