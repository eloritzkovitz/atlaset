import { useTranslation } from "react-i18next";
import { ModalSelect, type OverlayProps } from "@components";
import { ICONS } from "@constants/icons";
import type { TripTag } from "../../../core/types";

interface TagOption {
  value: TripTag;
  label: string;
}

interface TagSelectModalProps extends OverlayProps {
  selected: TripTag[];
  options: TagOption[];
  onChange: (newTags: TripTag[]) => void;
}

export function TagSelectModal({
  isOpen,
  selected,
  options,
  onChange,
  onClose,
}: TagSelectModalProps) {
  const { t } = useTranslation("trips");

  return (
    <ModalSelect<TagOption>
      isOpen={isOpen}
      title={
        <>
          <ICONS.tripTag />
          {t("editor.details.tags.select", "Select Tags")}
        </>
      }
      items={options}
      selectedValues={selected}
      getItemValue={(opt) => opt.value}
      getItemSearchLabel={(opt) => opt.label}
      emptyMessage={t("editor.details.tags.none")}
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
