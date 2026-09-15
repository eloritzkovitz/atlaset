import { useTranslation } from "react-i18next";
import { FormField, InputBox } from "@components";
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
  const { t } = useTranslation("trips");

  return (
    <div className="flex flex-col gap-4">
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

      <FormField label={t("fields.notes")}>
        <InputBox
          id="trip-notes"
          name="trip-notes"
          as="textarea"
          maxLength={2000}
          className="w-full min-h-48 resize-none"
          value={trip.notes ?? ""}
          onChange={(e: { target: { value: string } }) =>
            onChange({
              ...trip,
              notes: e.target.value,
            })
          }
          placeholder={t("editor.details.notes.placeholder")}
        />
      </FormField>
    </div>
  );
}
