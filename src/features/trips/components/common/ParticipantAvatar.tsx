import { useEffect } from "react";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { UserAvatar, useUserProfile } from "@features/user";

interface ParticipantAvatarProps {
  uid: string;
  flexOrder: number;
  onNameResolved: (name: string) => void;
  removable?: boolean;
  onRemove?: () => void;
}

export function ParticipantAvatar({
  uid,
  flexOrder,
  onNameResolved,
  removable = false,
  onRemove,
}: ParticipantAvatarProps) {
  const { profile } = useUserProfile({ uid });

  // Notify parent when name is resolved
  useEffect(() => {
    if (profile?.displayName) {
      onNameResolved(profile.displayName);
    }
  }, [profile?.displayName, onNameResolved]);

  // Show a placeholder while loading
  if (!profile) {
    return (
      <span
        style={{ order: flexOrder }}
        className="inline-block w-7 h-7 rounded-full bg-input animate-pulse"
      />
    );
  }

  return (
    <div style={{ order: flexOrder }} className="inline-flex">
      <ActionButton
        title={profile.displayName}
        titlePosition="bottom"
        ariaLabel={profile.displayName}
        variant="custom"
        rounded
        className="p-0 m-0 focus:outline-none group/avatar relative overflow-hidden rounded-full"
        style={{ width: 28, height: 28 }}
        onClick={(e) => {
          e.preventDefault();
          if (onRemove) {
            onRemove();
          } else {
            window.open(
              `/users/${profile.username}`,
              "_blank",
              "noopener,noreferrer",
            );
          }
        }}
        icon={
          <div className="relative w-7 h-7 rounded-full">
            <UserAvatar user={profile} size={28} />
            {removable && onRemove ? (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 transition-opacity duration-150 group-hover/avatar:opacity-100">
                <ICONS.close className="text-xs" />
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
