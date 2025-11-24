export type Settings = {
  id: string; // always 'main' for singleton settings
  homeCountry: string;
  colorHomeCountry: boolean;
  theme: 'light' | 'dark';
  projection?: string;
  borderColor?: string;
  borderWidth?: number;
  overlayPalettes?: Record<OverlayMode, string>;
};

// Overlay mode keys type definition
export type OverlayMode = "standard" | "cumulative" | "yearly";