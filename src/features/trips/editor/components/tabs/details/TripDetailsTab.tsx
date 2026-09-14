import type { Trip } from "@features/trips/core/types";
import { CategoriesSection } from "./CategoriesSection";
import { TagsSection } from "./TagsSection";

interface TripDetailsTabProps {
  trip: Trip;
  onChange: (trip: Trip) => void;
  onEditCategories: () => void;
  onEditTags: () => void;
}

/** Renders the details tab for a trip. */
export function TripDetailsTab({
  trip,
  onChange,
  onEditCategories,
  onEditTags,
}: TripDetailsTabProps) {
  return (
    <div className="flex flex-col gap-3">
      <CategoriesSection
        selectedCategories={trip.categories || []}
        onEdit={onEditCategories}
        onRemove={(category) =>
          onChange({
            ...trip,
            categories: (trip.categories || []).filter(
              (item) => item !== category,
            ),
          })
        }
      />

      <TagsSection
        selectedTags={trip.tags || []}
        onEdit={onEditTags}
        onRemove={(tag) =>
          onChange({
            ...trip,
            tags: (trip.tags || []).filter((item) => item !== tag),
          })
        }
      />
    </div>
  );
}
