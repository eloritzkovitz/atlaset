import React from "react";
import { _3x2 as Flags } from "@eloritzkovitz/atlaset-flags";
import { original as originalFlags } from "@eloritzkovitz/atlaset-flags";
import { SOVEREIGN_FLAG_MAP } from "../../constants/sovereignty";
import type { Flag } from "../../types/flag";

interface CountryFlagProps {
  flag: Flag;
  style?: React.CSSProperties;
  className?: string;
}

export function CountryFlag({ flag, style, className }: CountryFlagProps) {
  const size = Number(flag.size);
  const validSize = Number.isFinite(size) && size > 0 ? size : 32;
  const width = validSize;

  // Map to sovereign flag if applicable
  const mappedIso =
    SOVEREIGN_FLAG_MAP?.[flag.isoCode.toUpperCase()] ||
    flag.isoCode.toUpperCase();

  // Use 3x2 or original flag React components
  let FlagSvg:
    | React.ComponentType<{ style?: React.CSSProperties; className?: string }>
    | undefined;
  let aspectWidth = 3,
    aspectHeight = 2;
  if (flag.ratio === "3x2") {
    FlagSvg = Flags[mappedIso as keyof typeof Flags];
    aspectWidth = 3;
    aspectHeight = 2;
  } else {
    FlagSvg = originalFlags[mappedIso as keyof typeof originalFlags];

    // Try to parse original ratio
    if (
      flag.ratio &&
      typeof flag.ratio === "string" &&
      flag.ratio.includes("x")
    ) {
      const [w, h] = flag.ratio.split("x").map(Number);
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
        aspectWidth = w;
        aspectHeight = h;
      }
    }
  }

  // Calculate height based on aspect ratio
  const height = Math.round((width * aspectHeight) / aspectWidth);
  const flagStyle = {
    width,
    height,
    borderRadius: 4,
    ...style,
  };

  // Render the flag SVG if found
  if (FlagSvg) {
    return <FlagSvg style={flagStyle} className={className} />;
  }

  // Fallback: white flag
  return (
    <div
      style={{ ...flagStyle, background: "#fff", display: "inline-block" }}
      className={className}
    />
  );
}
