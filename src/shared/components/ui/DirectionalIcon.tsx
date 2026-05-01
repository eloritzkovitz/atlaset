import {
  FaChevronLeft,
  FaChevronRight,
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa6";
import { useLanguage } from "@features/settings";

interface DirectionalIconProps {
  direction?: "prev" | "next";
  variant?: "chevron" | "angle" | "arrow";
  className?: string;
  size?: string | number;
}

export function DirectionalIcon({
  direction = "next",
  variant = "chevron",
  className = "",
  size = "1em",
}: DirectionalIconProps) {
  const { isRtl } = useLanguage();

  // Map variant to corresponding icons
  const iconsMap = {
    chevron: [FaChevronLeft, FaChevronRight],
    angle: [FaAnglesLeft, FaAnglesRight],
    arrow: [FaArrowLeft, FaArrowRight],
  } as const;

  const [LeftIcon, RightIcon] = iconsMap[variant];

  const forwardIsLeft = isRtl;
  const showLeft = direction === "next" ? forwardIsLeft : !forwardIsLeft;
  const Icon = showLeft ? LeftIcon : RightIcon;

  return <Icon className={className} style={{ fontSize: size }} />;
}
