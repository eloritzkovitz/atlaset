import React from "react";
import * as Flags from "country-flag-icons/react/3x2";
import { SOVEREIGN_FLAG_MAP } from "../../constants/sovereignty";
import type { Flag } from "../../types/flag";
import JS from "./JS";

interface CountryFlagProps {
  flag: Flag;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}

// Combine imported flags with custom flags
const CustomFlags = { ...Flags, JS };

export function CountryFlag({ flag, alt, style, className }: CountryFlagProps) {
  // Convert flag.size (string | undefined) to number, default to 32
  const size = Number(flag.size);
  // For 4:3 flags, use a 4:3 aspect ratio (e.g., 32x24)
  const validSize = Number.isFinite(size) && size > 0 ? size : 32;
  const width = validSize;
  const height = Math.round(validSize * 0.75);

  // Map to sovereign flag if applicable
  const mappedIso =
    SOVEREIGN_FLAG_MAP?.[flag.isoCode.toUpperCase()] ||
    flag.isoCode.toUpperCase();

  // Handle custom 4:3 flags
  if (flag.ratio === "fourThree") {
    const FlagSvg = CustomFlags[mappedIso as keyof typeof CustomFlags];
    if (FlagSvg) {
      return (
        <FlagSvg
          style={{ width, height, borderRadius: 4, ...style }}
          className={className}
        />
      );
    }
    // Fallback: white flag
    return (
      <div
        style={{
          width,
          height,
          background: "#fff",
          borderRadius: 4,
          display: "inline-block",
          ...style,
        }}
        className={className}
      />
    );
  }

  // Default: use original aspect ratio
  return (
    <img
      src={`/flags/${mappedIso.toLowerCase()}.svg`}
      alt={alt || `${flag.isoCode} flag`}
      width={width}
      height={height}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
