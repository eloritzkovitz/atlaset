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
  const size = Number(flag.size);
  const validSize = Number.isFinite(size) && size > 0 ? size : 32;
  const width = validSize;

  // Map to sovereign flag if applicable
  const mappedIso =
    SOVEREIGN_FLAG_MAP?.[flag.isoCode.toUpperCase()] ||
    flag.isoCode.toUpperCase();

  // Handle special case for 3:2 ratio flags
  if (flag.ratio === "3x2") {
    const FlagSvg = CustomFlags[mappedIso as keyof typeof CustomFlags];
    const testHeight = Math.round((width * 2) / 3);
    const flagStyle = {
      width,
      height: testHeight,
      borderRadius: 4,
      ...style,
    };
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

  // Default: use original aspect ratio
  return (
    <img
      src={`/flags/${mappedIso.toLowerCase()}.svg`}
      alt={alt || `${flag.isoCode} flag`}
      width={width}
      height={Math.round((width * 2) / 3)}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
