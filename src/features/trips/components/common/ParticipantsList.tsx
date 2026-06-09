import { useState } from "react";
import { ActionButton } from "@components";
import { UserAvatar, useUserProfile, type UserProfile } from "@features/user";

interface ParticipantsListProps {
  uids: string[];
}

export function ParticipantsList({ uids }: ParticipantsListProps) {
  const [names, setNames] = useState<Record<string, string>>({});

  // Compute visual order based on loaded names
  const visualOrderMap = [...uids]
    .sort((a, b) => (names[a] || "").localeCompare(names[b] || ""))
    .reduce<Record<string, number>>((acc, uid, index) => {
      acc[uid] = index;
      return acc;
    }, {});

  return (
    <div className="flex">
      {uids.map((uid) => (
        <ParticipantAvatarItem
          key={uid}
          uid={uid}
          flexOrder={visualOrderMap[uid] ?? 0}
          onNameResolved={(name) => {
            if (names[uid] !== name) {
              setNames((prev) => ({ ...prev, [uid]: name }));
            }
          }}
        />
      ))}
    </div>
  );
}

function ParticipantAvatarItem({
  uid,
  flexOrder,
  onNameResolved,
}: {
  uid: string;
  flexOrder: number;
  onNameResolved: (name: string) => void;
}) {
  const { profile } = useUserProfile({ uid });

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
        icon={<UserAvatar user={profile as UserProfile} size={28} />}
        title={profile.displayName}
        titlePosition="bottom"
        ariaLabel={profile.displayName}
        variant="custom"
        rounded
        className="p-0 m-0 border-none focus:outline-none"
        style={{ width: 28, height: 28 }}
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `/users/${profile.username}`,
            "_blank",
            "noopener,noreferrer",
          );
        }}
      />
    </div>
  );
}
