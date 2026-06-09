import { useTranslation } from "react-i18next";
import { SelectionListModal } from "@components";
import { ICONS } from "@constants/icons";
import type { TripTag } from "../../types";

interface TagOption {
  value: TripTag;
  label: string;
}

interface TagSelectModalProps {
  isOpen: boolean;
  selected: TripTag[];
  options: TagOption[];
  onChange: (newTags: TripTag[]) => void;
  onClose: () => void;
}

export function TagSelectModal({
  isOpen,
  selected,
  options,
  onChange,
  onClose,
}: TagSelectModalProps) {
  const { t } = useTranslation(["trips", "common"]);

  return (
    <SelectionListModal<TagOption>
      isOpen={isOpen}
      title={
        <>
          <ICONS.tripTag />
          {t("trips:modal.tags.selectTitle", "Select Tags")}
        </>
      }
      items={options}
      selectedValues={selected}
      getItemValue={(opt) => opt.value}
      getItemSearchLabel={(opt) => opt.label}
      emptyMessage={t("trips:modal.tags.noResults", "No matching tags found.")}
      onChange={(values) => onChange(values as TripTag[])}
      onClose={onClose}
      renderItem={(opt) => (
        <div className="flex items-center gap-2">
          <span>{opt.label}</span>
        </div>
      )}
    />
  );
}
