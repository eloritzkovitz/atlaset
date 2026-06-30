import { useTranslation } from "react-i18next";
import { ModalSelect } from "@components";
import { ICONS } from "@constants/icons";
import { UserAvatar, type UserProfile } from "@features/user";

interface ParticipantOption {
  value: string;
  label: string;
  profile: UserProfile;
}

interface ParticipantSelectModalProps {
  isOpen: boolean;
  selected: string[];
  options: ParticipantOption[];
  onChange: (newParticipants: string[]) => void;
  onClose: () => void;
}

export function ParticipantSelectModal({
  isOpen,
  selected,
  options,
  onChange,
  onClose,
}: ParticipantSelectModalProps) {
  const { t } = useTranslation(["trips", "common"]);

  return (
    <ModalSelect<ParticipantOption>
      isOpen={isOpen}
      title={
        <>
          <ICONS.friends />
          {t("trips:modal.participants.selectTitle", "Select Participants")}
        </>
      }
      items={options}
      selectedValues={selected}
      getItemValue={(option) => option.value}
      getItemSearchLabel={(option) => option.label}
      emptyMessage={t(
        "trips:modal.participants.noResults",
        "No friends found.",
      )}
      onChange={onChange}
      onClose={onClose}
      renderItem={(option) => (
        <div className="flex items-center gap-2 min-w-0">
          <UserAvatar
            user={option.profile}
            size={28}
            className="flex-shrink-0"
          />
          <span className="truncate text-sm">{option.label}</span>
        </div>
      )}
    />
  );
}
