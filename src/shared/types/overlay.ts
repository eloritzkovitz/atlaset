export type Overlay = {
  id: string;
  name: string;
  color: string;
  countries: string[];
  tooltip?: string;
  visible: boolean;
  order?: number;
};

export type TimelineOverlay = Overlay & {
  timelineEnabled: true;
  timelineSnapshot?: boolean;
};

// Union type for any overlay
export type AnyOverlay = Overlay | TimelineOverlay;

export type OverlayItem = {
  isoCode: string;
  color?: string;
  overlayId: string;
  tooltip?: string;
  style?: React.CSSProperties;
};
