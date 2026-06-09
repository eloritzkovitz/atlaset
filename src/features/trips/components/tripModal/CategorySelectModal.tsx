import { useTranslation } from "react-i18next";
import { SelectionListModal } from "@components";
import { ICONS } from "@constants/icons";
import { TRIP_CATEGORY_ICONS } from "../../constants/tripCategoryIcons";
import type { TripCategory } from "../../types";

interface CategoryOption {
  value: TripCategory;
  label: string;
}

interface CategorySelectModalProps {
  isOpen: boolean;
  selected: TripCategory[];
  options: CategoryOption[];
  onChange: (newCategories: TripCategory[]) => void;
  onClose: () => void;
}

export function CategorySelectModal({
  isOpen,
  selected,
  options,
  onChange,
  onClose,
}: CategorySelectModalProps) {
  const { t } = useTranslation(["trips", "common"]);

  return (
    <SelectionListModal<CategoryOption>
      isOpen={isOpen}
      title={
        <>
          <ICONS.tripCategory className="text-2xl" />
          {t("trips:modal.categories.selectTitle", "Select Categories")}
        </>
      }
      items={options}
      selectedValues={selected}
      getItemValue={(opt) => opt.value}
      getItemSearchLabel={(opt) => opt.label}
      emptyMessage={t(
        "trips:modal.categories.noResults",
        "No matching categories found.",
      )}
      onChange={(values) => onChange(values as TripCategory[])}
      onClose={onClose}
      renderItem={(opt) => (
        <div className="flex items-center gap-2">
          {TRIP_CATEGORY_ICONS[opt.value] ?? null}
          <span>{opt.label}</span>
        </div>
      )}
    />
  );
}
