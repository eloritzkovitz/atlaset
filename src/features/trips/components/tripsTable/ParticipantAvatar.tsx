import { ActionButton } from "@components";
import { UserAvatar, useUserProfile } from "@features/user";

export function ParticipantAvatar({ uid }: { uid: string }) {
  const { profile } = useUserProfile({ uid });

  // Show placeholder if profile is not loaded
  if (!profile)
    return <span className="inline-block w-8 h-8 rounded-full bg-gray-200" />;

  return (
    <ActionButton
      icon={<UserAvatar user={profile} size={28} />}
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
          "noopener,noreferrer"
        );
      }}
    />
  );
}
