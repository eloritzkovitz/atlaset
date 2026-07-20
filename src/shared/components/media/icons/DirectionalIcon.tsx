import {
  FaChevronRight,
  FaAnglesRight,
  FaArrowRight,
  FaChevronLeft,
  FaAnglesLeft,
  FaArrowLeft,
} from "react-icons/fa6";

interface DirectionalIconProps {
  direction?: "prev" | "next";
  variant?: "chevron" | "angle" | "arrow";
  className?: string;
  size?: string | number;
}

const iconsMap = {
  chevron: { next: FaChevronRight, prev: FaChevronLeft },
  angle: { next: FaAnglesRight, prev: FaAnglesLeft },
  arrow: { next: FaArrowRight, prev: FaArrowLeft },
} as const;

/** Renders a directional icon based on the specified direction and variant. */
export function DirectionalIcon({
  direction = "next",
  variant = "chevron",
  className = "",
  size = "1em",
}: DirectionalIconProps) {
  const Icon = iconsMap[variant][direction];

  return (
    <Icon
      className={`rtl:rotate-180 transition-transform ${className}`}
      style={{ fontSize: size }}
    />
  );
}
