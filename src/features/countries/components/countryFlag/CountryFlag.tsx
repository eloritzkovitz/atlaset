import React from "react";
import { _3x2 as Flags } from "@eloritzkovitz/atlaset-flags";
import { SOVEREIGN_FLAG_MAP } from "../../constants/sovereignty";
import type { Flag } from "../../types/flag";

interface CountryFlagProps {
  flag: Flag;
  style?: React.CSSProperties;
  className?: string;
}

export function CountryFlag({ flag, style, className }: CountryFlagProps) {
  const size = Number(flag.size);
  // For 3x2 flags, use a 3:2 aspect ratio
  const validSize = Number.isFinite(size) && size > 0 ? size : 32;
  const width = validSize;
  const height = Math.round((width * 2) / 3);

  // Map to sovereign flag if applicable
  const mappedIso = SOVEREIGN_FLAG_MAP?.[flag.isoCode] || flag.isoCode;

  // Handle 3x2 flags
  if (flag.ratio === "3x2") {
    const FlagSvg = Flags[mappedIso as keyof typeof Flags];
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
      src={`/flags/${mappedIso}.svg`}
      alt={`${flag.isoCode} flag`}
      width={width}
      height={height}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
