import { useState } from "react";
import { FaUser, FaPencil } from "react-icons/fa6";
import { ActionButton } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { EditProfileModal, useUserProfile } from "@features/user";
import { SettingsCard } from "../SettingsCard";

export function ProfileSection() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Fetch user profile
  const { profile, loading } = useUserProfile({ uid: user?.uid });

  return (
    <SettingsCard title="Profile" icon={<FaUser />}>
      <div className="flex items-center gap-2 mb-2 w-full">
        <div className="flex-1 font-medium truncate">Profile information</div>
        <ActionButton
          icon={<FaPencil />}
          onClick={() => setOpen(true)}
          disabled={loading}
          variant="secondary"
          className="btn-xs"
          ariaLabel="Edit profile"
        >
          Edit
        </ActionButton>
      </div>
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
