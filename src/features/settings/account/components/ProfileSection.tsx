import { useState } from "react";
import { FaUser, FaPencil } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { EditProfileModal, useUserProfile } from "@features/user/profile";
import { SettingsCard } from "../../common/components/SettingsCard";
import { SettingsRow } from "../../common/components/SettingsRow";

export function ProfileSection() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile({ uid: user?.uid });

  const [open, setOpen] = useState(false);
  const { t } = useTranslation("settings");

  return (
    <SettingsCard title={t("account.profile.title")} icon={<FaUser />}>
      <SettingsRow
        label={t("account.profile.info")}
        labelClassName="font-medium truncate"
        control={
          <ActionButton
            onClick={() => setOpen(true)}
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
          open={open}
          onClose={() => setOpen(false)}
          onSave={() => setOpen(false)}
        />
      )}
    </SettingsCard>
  );
}
