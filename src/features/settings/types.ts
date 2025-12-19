import type { OverlayMode } from '@types';

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
