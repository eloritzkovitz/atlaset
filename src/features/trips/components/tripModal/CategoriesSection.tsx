import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { ICONS } from "@constants/icons";
import { CategoriesList } from "../common/CategoriesList";
import type { TripCategory } from "../../types";

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
          {t("modal.form.categories", "Categories")}
        </span>
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-input-hover text-sm font-medium"
          onClick={onEdit}
        >
          <ICONS.edit className="me-1" />
          {selectedCategories.length > 0
            ? t("modal.actions.edit")
            : t("modal.actions.add")}
        </button>
      </div>

      {selectedCategories.length === 0 ? (
        <EmptyListMessage
          message={t("modal.form.noCategories", "No categories selected.")}
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
