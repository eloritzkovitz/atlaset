import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { ICONS } from "@constants/icons";
import { TagsList } from "../common/TagsList";
import type { TripTag } from "../../types";

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
        <span className="font-semibold">{t("modal.form.tags", "Tags")}</span>
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-input-hover text-sm font-medium"
          onClick={onEdit}
        >
          <ICONS.edit className="me-1" />
          {selectedTags.length > 0
            ? t("modal.actions.edit")
            : t("modal.actions.add")}
        </button>
      </div>

      {selectedTags.length === 0 ? (
        <EmptyListMessage
          message={t("modal.form.noTags", "No tags selected.")}
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
