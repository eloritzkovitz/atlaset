import { useTranslation } from "react-i18next";
import { ModalSelect } from "@components";
import { ICONS } from "@constants/icons";
import { TRIP_CATEGORY_ICONS } from "../../../core/constants/tripCategoryIcons";
import type { TripCategory } from "../../../core/types";

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
    <ModalSelect<CategoryOption>
      isOpen={isOpen}
      title={
        <>
          <ICONS.tripCategory className="text-2xl" />
          {t("trips:editor.details.categories.select", "Select categories")}
        </>
      }
      items={options}
      selectedValues={selected}
      getItemValue={(opt) => opt.value}
      getItemSearchLabel={(opt) => opt.label}
      emptyMessage={t(
        "trips:editor.details.categories.none",
        "No categories selected.",
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
