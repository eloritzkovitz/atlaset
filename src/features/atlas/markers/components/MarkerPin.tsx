import { Tooltip } from "@components";
import type { Point } from "@types";

interface MarkerPinProps {
  position: Point;
  color?: string;
  name: string;
  zoom?: number;
  onClick: (event: React.MouseEvent<SVGGElement>, point: Point) => void;
}

/** Render a marker pin on the map.*/
export function MarkerPin({
  position,
  color,
  name,
  zoom = 1,
  onClick,
}: MarkerPinProps) {
  const { x, y } = position;
  const headColor = color || "#ffffff";
  const outlineColor = "#18181b";

  return (
    <Tooltip content={name} position="right">
      <g
        transform={`translate(${x},${y}) scale(${1 / zoom})`}
        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={(event) => onClick(event, position)}
      >
        {/* Base drop shadow */}
        <ellipse
          cx={0}
          cy={0}
          rx={3}
          ry={1.5}
          fill="rgba(0, 0, 0, 0.35)"
          className="pointer-events-none"
        />

        {/* Pin Stem */}
        <rect
          x={-1.5}
          y={-10}
          width={3}
          height={10}
          rx={1.5}
          fill={headColor}
          stroke={outlineColor}
          strokeWidth={0.75}
        />

        {/* Main Spherical Head */}
        <circle
          cx={0}
          cy={-17}
          r={7}
          fill={headColor}
          stroke={outlineColor}
          strokeWidth={1}
        />

        {/* Inner Shine Curve */}
        <path
          d="M -3.5 -19.5 A 4.5 4.5 0 0 1 1 -22.5"
          fill="none"
          stroke={
            headColor === "#ffffff"
              ? "rgba(0, 0, 0, 0.25)"
              : "rgba(255, 255, 255, 0.6)"
          }
          strokeWidth={1.25}
          strokeLinecap="round"
        />
      </g>
    </Tooltip>
  );
}
