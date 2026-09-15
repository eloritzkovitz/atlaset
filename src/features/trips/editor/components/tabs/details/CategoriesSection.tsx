import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage } from "@components";
import { ICONS } from "@constants/icons";
import type { TripCategory } from "@features/trips/core/types";
import { CategoriesList } from "../../../../core/components/CategoriesList";

interface CategoriesSectionProps {
  selectedCategories: TripCategory[];
  onEdit: () => void;
  onRemove: (category: TripCategory) => void;
}

export function CategoriesSection({
  selectedCategories,
  onEdit,
  onRemove,
}: CategoriesSectionProps) {
  const { t } = useTranslation("trips");

  return (
    <div className="flex-1 min-h-0 pt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">
          {t("fields.categories", "Categories")}
        </span>
        <ActionButton
          type="button"
          icon={<ICONS.editField />}
          onClick={onEdit}
          rounded
        />
      </div>

      {selectedCategories.length === 0 ? (
        <EmptyListMessage
          message={t("editor.details.noCategories", "No categories selected.")}
        />
      ) : (
        <CategoriesList
          categories={selectedCategories}
          removable={true}
          onRemove={onRemove}
          limit={50}
        />
      )}
    </div>
  );
}
