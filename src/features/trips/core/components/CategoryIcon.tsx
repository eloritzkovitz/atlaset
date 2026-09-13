import { TRIP_CATEGORY_ICONS } from "../constants/categories";
import type { TripCategory } from "../types";

interface CategoryIconProps {
  category: TripCategory;
}

export function CategoryIcon({ category }: CategoryIconProps) {
  const Icon = TRIP_CATEGORY_ICONS[category];

  return Icon ? <Icon aria-hidden="true" /> : null;
}
