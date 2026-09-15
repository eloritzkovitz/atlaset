import { useTranslation } from "react-i18next";
import { EmptyListMessage, FieldHeader } from "@components";
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
      <FieldHeader
        label={t("fields.tags")}
        onEdit={onEdit}
        editLabel={t("editor.details.tags.select")}
      />

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
