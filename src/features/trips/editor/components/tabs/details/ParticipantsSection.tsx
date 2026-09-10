import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { ICONS } from "@constants/icons";
import { ParticipantsList } from "@features/trips/core/components/ParticipantsList";
import type { UserProfile } from "@features/user/profile/types";

interface ParticipantsSectionProps {
  selectedParticipants: UserProfile[];
  onEdit: () => void;
  onRemove: (uid: string) => void;
}

export function ParticipantsSection({
  selectedParticipants,
  onEdit,
  onRemove,
}: ParticipantsSectionProps) {
  const { t } = useTranslation("trips");

  return (
    <div className="flex-1 min-h-0 pt-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">
          {t("fields.participants", "Participants")}
        </span>
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-input-hover text-sm font-medium"
          onClick={onEdit}
        >
          <ICONS.edit className="me-1" />
          {selectedParticipants.length > 0
            ? t("editor.actions.edit")
            : t("editor.actions.add")}
        </button>
      </div>

      {selectedParticipants.length === 0 ? (
        <EmptyListMessage
          message={t(
            "editor.details.noParticipants",
            "No participants added yet.",
          )}
        />
      ) : (
        <div className="p-1">
          <ParticipantsList
            uids={selectedParticipants.map((p) => p.uid)}
            onRemove={onRemove}
          />
        </div>
      )}
    </div>
  );
}
