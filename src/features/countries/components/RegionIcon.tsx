import type { ComponentType } from "react";
import {
  FaCircle,
  FaEarthAfrica,
  FaEarthAmericas,
  FaEarthAsia,
  FaEarthEurope,
  FaEarthOceania,
} from "react-icons/fa6";
import type { IconBaseProps } from "react-icons";

// Map region keys to Icon Components (not JSX nodes)
const REGION_ICON_MAP: Record<string, ComponentType<IconBaseProps>> = {
  africa: FaEarthAfrica,
  europe: FaEarthEurope,
  asia: FaEarthAsia,
  americas: FaEarthAmericas,
  oceania: FaEarthOceania,
};

interface RegionIconProps extends IconBaseProps {
  region?: string;
}

/** Renders the corresponding globe icon for a given world region. */
export function RegionIcon({
  region,
  className = "text-2xl ms-1 me-1",
  ...props
}: RegionIconProps) {
  const normalizedRegion = region?.toLowerCase() ?? "";
  const IconComponent = REGION_ICON_MAP[normalizedRegion] ?? FaCircle;

  return <IconComponent className={className} {...props} />;
}
