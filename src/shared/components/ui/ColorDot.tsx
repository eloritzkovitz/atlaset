interface ColorDotProps {
  color: string;
  size?: number;
  className?: string;
}

export function ColorDot({ color, size = 14, className = "" }: ColorDotProps) {
  return (
    <span
      className={`inline-block rounded-full color-dot ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        border: "none",
      }}
    />
  );
}
