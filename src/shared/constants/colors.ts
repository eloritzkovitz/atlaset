import type { ColorPalette } from "@types";

// Background color
export const MAP_BG_COLOR = "#b5bfca";

// Border colors
export const MAP_BORDER_COLOR_LIGHT = "#ccc";
export const MAP_BORDER_COLOR_GRAY = "#888";
export const MAP_BORDER_COLOR_DARK = "#222";

// Home country color
export const HOME_COUNTRY_COLOR = "#00dbbe";

// Classic palettes

export const DEFAULT_PALETTE: ColorPalette = {
  name: "Default",
  colors: ["#0078d4", "#4a90e2", "#f58549", "#f9ae5d", "#fcd9b4"],
};

export const LIGHT_PALETTE: ColorPalette = {
  name: "Light",
  colors: ["#f9e2ae", "#e0f2fe", "#cbd5e1", "#e2e8f0", "#f8fafc"],
};

export const DARK_PALETTE: ColorPalette = {
  name: "Dark",
  colors: ["#1b1b1b", "#2e2e2e", "#4a4a4a", "#6e6e6e", "#9b9b9b"],
};

export const REGAL_PALETTE: ColorPalette = {
  name: "Regal",
  colors: ["#3b0a45", "#5c1a72", "#c288ca", "#dabd3f", "#dfcc7b"],
};

export const VIBRANT_PALETTE: ColorPalette = {
  name: "Vibrant",
  colors: ["#ff6f61", "#6b5b95", "#88b04b", "#f7cac9", "#92a8d1"],
};

// Pastel palettes
export const PASTEL_SOFT_PALETTE: ColorPalette = {
  name: "Pastel Soft",
  colors: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9"],
};

export const PASTEL_BRIGHT_PALETTE: ColorPalette = {
  name: "Pastel Bright",
  colors: ["#bae1ff", "#ffb3ba", "#ffdfba", "#ffffba", "#baffc9"],
};

export const PASTEL_BLOOM_PALETTE: ColorPalette = {
  name: "Pastel Bloom",
  colors: ["#ff8c8c", "#d1dd93", "#f0edaa", "#c2d5f4", "#bdeeed"],
};

export const PASTEL_STRAWBERRY_PALETTE: ColorPalette = {
  name: "Pastel Strawberry",
  colors: ["#ff9c9c", "#ffb0b0", "#ffcccc", "#ffe1e1", "#fff0f0"],
};

export const PASTEL_PEACH_PALETTE: ColorPalette = {
  name: "Pastel Peach",
  colors: ["#ffb3b3", "#ffccbb", "#ffe0cc", "#fff2e6", "#fff8f0"],
};

export const PASTEL_CITRUS_PALETTE: ColorPalette = {
  name: "Pastel Citrus",
  colors: ["#ffc774", "#fad295", "#ffe680", "#fff2b8", "#fff9d1"],
};

export const PASTEL_LEMON_PALETTE: ColorPalette = {
  name: "Pastel Lemon",
  colors: ["#fdfd96", "#f5e6a2", "#f9f5ac", "#fff9c4", "#fffacd"],
};

export const PASTEL_MINT_PALETTE: ColorPalette = {
  name: "Pastel Mint",
  colors: ["#90b89b", "#abd2b6", "#c9e7d2", "#dcf0e2", "#e6f6eb"],
};

export const PASTEL_SEA_PALETTE: ColorPalette = {
  name: "Pastel Sea",
  colors: ["#a0d8ef", "#b3e5fc", "#cceeff", "#e0f7fa", "#f0faff"],
};

export const PASTEL_VIOLET_PALETTE: ColorPalette = {
  name: "Pastel Violet",
  colors: ["#e1bee7", "#d1c4e9", "#fcccdd", "#f3e5f5", "#fce4ec"],
};

// Times of Day palettes

export const MORNING_PALETTE: ColorPalette = {
  name: "Morning",
  colors: ["#ff9a8b", "#ffb347", "#ffd700", "#a1cfff", "#6ec1e4"],
};

export const MIDDAY_PALETTE: ColorPalette = {
  name: "Midday",
  colors: ["#ff4500", "#ff8c00", "#ffd700", "#1e90ff", "#00ced1"],
};

export const SUNSET_PALETTE: ColorPalette = {
  name: "Sunset",
  colors: ["#ff5e5b", "#d8a47f", "#ffd97d", "#8ac6d1", "#ff9a76"],
};

export const TWILIGHT_PALETTE: ColorPalette = {
  name: "Twilight",
  colors: ["#8275f5", "#bf4e64", "#e06d56", "#e8ab2c", "#f0d769"],
};

export const DUSK_PALETTE: ColorPalette = {
  name: "Dusk",
  colors: ["#29005e", "#4f1b74", "#9b6fa7", "#ccb7c0", "#f2f2b8"],
};

// Seasons palettes

export const SPRING_PALETTE: ColorPalette = {
  name: "Spring",
  colors: ["#5e8d5a", "#f68f3c", "#ee6f68", "#f6b9ad", "#c6d7b9"],
};

export const SUMMER_PALETTE: ColorPalette = {
  name: "Summer",
  colors: ["#ffb347", "#ffcc33", "#ffff66", "#99ff99", "#66b3ff"],
};

export const AUTUMN_PALETTE: ColorPalette = {
  name: "Autumn",
  colors: ["#996100", "#b17900", "#cc8014", "#e4a331", "#f5ce89"],
};

export const WINTER_PALETTE: ColorPalette = {
  name: "Winter",
  colors: ["#3a5f7d", "#6b8fa3", "#a6ddf8", "#dbf1ff", "#f1f8fb"],
};

// Nature palettes

export const OCEAN_PALETTE: ColorPalette = {
  name: "Ocean",
  colors: ["#00224f", "#0048a7", "#0091e4", "#5ccdff", "#abdfff"],
};

export const COASTAL_PALETTE: ColorPalette = {
  name: "Coastal",
  colors: ["#034f84", "#92a8d1", "#b3cde0", "#f7cac9", "#f7786b"],
};

export const WETLANDS_PALETTE: ColorPalette = {
  name: "Wetlands",
  colors: ["#44481c", "#54582c", "#7d5e18", "#978e43", "#bcbd84"],
};

export const TROPICAL_PALETTE: ColorPalette = {
  name: "Tropical",
  colors: ["#1a535c", "#4ecdc4", "#88d8b0", "#ffcc5c", "#ff6f61"],
};

export const RAINFOREST_PALETTE: ColorPalette = {
  name: "Rainforest",
  colors: ["#014421", "#228B22", "#6B8E23", "#B2D8B2", "#FFD700"],
};

export const FOREST_PALETTE: ColorPalette = {
  name: "Forest",
  colors: ["#1e5636", "#578c49", "#99be8f", "#8f8350", "#b6a576"],
};

export const WOODLAND_PALETTE: ColorPalette = {
  name: "Woodland",
  colors: ["#a3a948", "#a67c00", "#d4af37", "#edb92e", "#f0e68c"],
};

export const HEATH_PALETTE: ColorPalette = {
  name: "Heath",
  colors: ["#6a4c93", "#ab83a1", "#b5b682", "#a9b18f", "#e6e6e6"],
};

export const GRASSLAND_PALETTE: ColorPalette = {
  name: "Grassland",
  colors: ["#556b2f", "#7c9a3c", "#b4c95d", "#d9e6a2", "#f0f4c3"],
};

export const SAVANNAH_PALETTE: ColorPalette = {
  name: "Savannah",
  colors: ["#965733", "#a6a300", "#f4a261", "#ecc28a", "#ffe5b4"],
};

export const DESERT_PALETTE: ColorPalette = {
  name: "Desert",
  colors: ["#c57519", "#ee964b", "#e4a672", "#f4d35e", "#ddc3a2"],
};

export const MOUNTAIN_PALETTE: ColorPalette = {
  name: "Mountain",
  colors: ["#4b3b2b", "#7d6a4f", "#a89f91", "#c3b9b0", "#e6e2d3"],
};

export const VOLCANO_PALETTE: ColorPalette = {
  name: "Volcano",
  colors: ["#2d2d2d", "#7f0000", "#ff4500", "#ffa500", "#fff700"],
};

export const TUNDRA_PALETTE: ColorPalette = {
  name: "Tundra",
  colors: ["#684a4a", "#aa8484", "#29a1ff", "#84c3f4", "#c8e4fa"],
};

export const GLACIER_PALETTE: ColorPalette = {
  name: "Glacier",
  colors: ["#2a85df", "#559fe8", "#7fb8f0", "#a9d0f5", "#d0e7f9"],
};

export const COLOR_PALETTE_GROUPS = [
  {
    label: "Classic",
    palettes: [
      DEFAULT_PALETTE,
      LIGHT_PALETTE,
      DARK_PALETTE,
      REGAL_PALETTE,
      VIBRANT_PALETTE,
    ],
  },
  {
    label: "Pastel",
    palettes: [
      PASTEL_SOFT_PALETTE,
      PASTEL_BRIGHT_PALETTE,
      PASTEL_BLOOM_PALETTE,
      PASTEL_STRAWBERRY_PALETTE,
      PASTEL_PEACH_PALETTE,
      PASTEL_CITRUS_PALETTE,
      PASTEL_LEMON_PALETTE,
      PASTEL_MINT_PALETTE,   
      PASTEL_SEA_PALETTE,
      PASTEL_VIOLET_PALETTE,   
    ],
  },
  {
    label: "Times of Day",
    palettes: [
      MORNING_PALETTE,
      MIDDAY_PALETTE,
      SUNSET_PALETTE,
      TWILIGHT_PALETTE,
      DUSK_PALETTE,
    ],
  },
  {
    label: "Seasons",
    palettes: [SPRING_PALETTE, SUMMER_PALETTE, AUTUMN_PALETTE, WINTER_PALETTE],
  },
  {
    label: "Nature",
    palettes: [
      OCEAN_PALETTE,
      COASTAL_PALETTE,
      WETLANDS_PALETTE,
      TROPICAL_PALETTE,
      RAINFOREST_PALETTE,
      FOREST_PALETTE,
      WOODLAND_PALETTE,
      HEATH_PALETTE,
      GRASSLAND_PALETTE,
      SAVANNAH_PALETTE,
      DESERT_PALETTE,
      MOUNTAIN_PALETTE,
      VOLCANO_PALETTE,
      TUNDRA_PALETTE,
      GLACIER_PALETTE,
    ],
  },
];

export const COLOR_PALETTES: ColorPalette[] = [
  ...COLOR_PALETTE_GROUPS.flatMap((group) => group.palettes),
];
