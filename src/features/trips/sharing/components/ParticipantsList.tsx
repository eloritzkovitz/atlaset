import { useState } from "react";
import { ParticipantAvatar } from "./ParticipantAvatar";

interface ParticipantsListProps {
  uids: string[];
  onRemove?: (uid: string) => void;
}

export function ParticipantsList({ uids, onRemove }: ParticipantsListProps) {
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
        <ParticipantAvatar
          key={uid}
          uid={uid}
          flexOrder={visualOrderMap[uid] ?? 0}
          onNameResolved={(name) => {
            if (names[uid] !== name) {
              setNames((prev) => ({ ...prev, [uid]: name }));
            }
          }}
          removable={!!onRemove}
          onRemove={onRemove ? () => onRemove(uid) : undefined}
        />
      ))}
    </div>
  );
}
