import { FaUser, FaPencil } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { useAuth } from "@features/user/auth";
import { EditProfileModal, useUserProfile } from "@features/user/profile";
import { useDisclosure } from "@hooks";
import { SettingsCard } from "../../core/components/SettingsCard";
import { SettingsRow } from "../../core/components/SettingsRow";

export function ProfileSection() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile({ uid: user?.uid });
  const { t } = useTranslation("settings");

  const editModal = useDisclosure();

  return (
    <SettingsCard title={t("account.profile.title")} icon={<FaUser />}>
      <SettingsRow
        label={t("account.profile.info")}
        labelClassName="font-medium truncate"
        control={
          <ActionButton
            onClick={() => editModal.open()}
            disabled={loading}
            variant="secondary"
            className="btn-xs"
            ariaLabel={t("account.profile.editAria")}
          >
            <FaPencil />
            {t("account.profile.edit")}
          </ActionButton>
        }
      />

      {profile && (
        <EditProfileModal
          user={user}
          profile={profile}
          open={editModal.isOpen}
          onClose={editModal.close}
          onSave={editModal.close}
        />
      )}
    </SettingsCard>
  );
}
