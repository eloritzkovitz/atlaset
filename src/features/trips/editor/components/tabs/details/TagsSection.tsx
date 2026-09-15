import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage } from "@components";
import { ICONS } from "@constants/icons";
import type { TripTag } from "@features/trips/core/types";
import { TagsList } from "../../../../core/components/TagsList";

interface TagsSectionProps {
  selectedTags: TripTag[];
  onEdit: () => void;
  onRemove: (tag: TripTag) => void;
}

export function TagsSection({
  selectedTags,
  onEdit,
  onRemove,
}: TagsSectionProps) {
  const { t } = useTranslation("trips");

  return (
    <div className="flex-1 min-h-0 pt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{t("fields.tags", "Tags")}</span>
        <ActionButton
          type="button"
          icon={<ICONS.editField />}
          onClick={onEdit}
          rounded
        />
      </div>

      {selectedTags.length === 0 ? (
        <EmptyListMessage
          message={t("editor.details.noTags", "No tags selected.")}
        />
      ) : (
        <TagsList
          tags={selectedTags}
          removable={true}
          onRemove={onRemove}
          limit={50}
        />
      )}
    </div>
  );
}
