import { FaStar } from "react-icons/fa6";
import { STAR_UNSELECTED_COLOR, STAR_SIZE } from "./constants";

interface HalfStarProps {
  size?: number;
  color?: string;
}

export function HalfStar({ size = STAR_SIZE, color }: HalfStarProps) {
  const half = size / 2;
  const isRtl =
    typeof document !== "undefined" && document.documentElement?.dir === "rtl";
  const firstStyle: React.CSSProperties = isRtl
    ? { right: 0, width: half, height: size }
    : { left: 0, width: half, height: size };
  const secondStyle: React.CSSProperties = isRtl
    ? { right: half, width: half, height: size }
    : { left: half, width: half, height: size };
  const innerOffsetStyle: React.CSSProperties = isRtl
    ? { position: "relative", right: -half }
    : { position: "relative", left: -half };

  return (
    <>
      <span
        className="absolute inline-block top-0 overflow-hidden"
        style={firstStyle}
      >
        <FaStar size={size} color={color} />
      </span>
      <span
        className="absolute inline-block top-0 overflow-hidden"
        style={secondStyle}
      >
        <FaStar
          size={size}
          color={STAR_UNSELECTED_COLOR}
          style={innerOffsetStyle}
        />
      </span>
      <span className="invisible">
        <FaStar size={size} />
      </span>
    </>
  );
}
