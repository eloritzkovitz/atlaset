import { ColorDot } from "@components";

interface PaletteDotsProps {
  colors: string[];
  size?: number;
  gap?: number;
}

export function PaletteDots({ colors, size = 22, gap = 3 }: PaletteDotsProps) {
  return (
    <span style={{ display: "inline-flex", gap, marginRight: 8 }}>
      {colors.map((color, i) => (
        <ColorDot key={i} color={color} size={size} />
      ))}
    </span>
  );
}
