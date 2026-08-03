import { useTranslation } from "react-i18next";
import { ChipList } from "@components";
import { capitalizeWords } from "@utils";
import { TRIP_CATEGORY_ICONS } from "../../constants/tripCategoryIcons";
import type { TripCategory } from "../../types";

interface CategoriesListProps {
  categories: TripCategory[];
  removable?: boolean;
  onRemove?: (category: TripCategory) => void;
  limit?: number;
}

export function CategoriesList({
  categories,
  removable,
  onRemove,
  limit,
}: CategoriesListProps) {
  const { t } = useTranslation("trips");

  // Format categories for display
  const formatCategory = (cat: TripCategory) =>
    t(`categories.${cat}`, capitalizeWords(cat));

  return (
    <ChipList<TripCategory>
      items={categories}
      limit={limit}
      removable={removable}
      onRemove={onRemove}
      renderItem={(cat) => (
        <span className="flex items-center gap-1">
          {TRIP_CATEGORY_ICONS[cat] ?? null}
          <span>{formatCategory(cat)}</span>
        </span>
      )}
      getTooltipLabel={formatCategory}
    />
  );
}
