import { FaStar } from "react-icons/fa6";
import { STAR_UNSELECTED_COLOR, STAR_SIZE } from "./star";

interface HalfStarProps {
  size?: number;
  color?: string;
}

export function HalfStar({ size = STAR_SIZE, color }: HalfStarProps) {
  const half = size / 2;
  return (
    <>
      <span
        className="absolute inline-block top-0 overflow-hidden"
        style={{ left: 0, width: half, height: size }}
      >
        <FaStar size={size} color={color} />
      </span>
      <span
        className="absolute inline-block top-0 overflow-hidden"
        style={{ left: half, width: half, height: size }}
      >
        <FaStar
          size={size}
          color={STAR_UNSELECTED_COLOR}
          style={{ position: "relative", left: -half }}
        />
      </span>
      <span className="invisible">
        <FaStar size={size} />
      </span>
    </>
  );
}
