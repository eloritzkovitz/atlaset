import { ActionButton } from "@components";
import { UserAvatar, useUserProfile, type UserProfile } from "@features/user";
import { FaXmark } from "react-icons/fa6";

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

  // Show a placeholder while loading
  if (!profile) {
    return (
      <span
        style={{ order: flexOrder }}
        className="inline-block w-7 h-7 rounded-full bg-gray-200 border-2 border-white animate-pulse"
      />
    );
  }

  // Pass name back up to the parent so it can re-index the visual orders
  onNameResolved(profile.displayName);

  return (
    <div style={{ order: flexOrder }} className="inline-flex">
      <ActionButton
        title={profile.displayName}
        titlePosition="bottom"
        ariaLabel={profile.displayName}
        variant="custom"
        rounded
        className="p-0 m-0 border-none focus:outline-none group/avatar relative overflow-hidden rounded-full"
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
            <UserAvatar user={profile as UserProfile} size={28} />
            {removable && onRemove ? (
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 transition-opacity duration-150 group-hover/avatar:opacity-100">
                <FaXmark className="text-xs" />
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
