import { SectionHeader } from "@components";
import { FriendList } from "../../friends/components/FriendList";
import type { UserProfile } from "../../types";

interface FriendsListSectionProps {
  loading: boolean;
  profiles: UserProfile[];
  onBack: () => void;
}

export function FriendsListSection({
  loading,
  profiles,
  onBack,
}: FriendsListSectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Friends" className="text-2xl mb-0" />
        <button
          className="text-muted hover:text-primary text-lg font-semibold"
          onClick={onBack}
        >
          Back to Profile
        </button>
      </div>
      {loading ? (
        <div>Loading friends...</div>
      ) : (
        <FriendList profiles={profiles} search="" />
      )}
    </div>
  );
}
