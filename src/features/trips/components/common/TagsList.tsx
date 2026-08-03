import { useTranslation } from "react-i18next";
import { ChipList } from "@components";
import { capitalizeWords } from "@utils";
import type { TripTag } from "../../types";

interface TagsListProps {
  tags: TripTag[];
  removable?: boolean;
  onRemove?: (tag: TripTag) => void;
  limit?: number;
}

export function TagsList({ tags, removable, onRemove, limit }: TagsListProps) {
  const { t } = useTranslation("trips");

  // Format tag for display
  const formatTag = (tag: TripTag) => t(`tags.${tag}`, capitalizeWords(tag));

  return (
    <ChipList<TripTag>
      items={tags}
      limit={limit}
      removable={removable}
      onRemove={onRemove}
      renderItem={formatTag}
      getTooltipLabel={formatTag}
    />
  );
}
