import type { Permission } from "@features/user/permissions/types";
import type { UserProfile } from "@features/user/profile/types";
import { PeopleSection } from "./PeopleSection";
import type { TripPerson } from "../../../types";

interface TripPeopleTabProps {
  people: TripPerson[];
  searchResults: UserProfile[];
  onSearch: (query: string) => void;
  onAdd: (profile: UserProfile) => void;
  onAddParticipant: (profile: UserProfile) => void;
  onRemove: (uid: string) => void;
  onPermissionChange: (uid: string, permission: Permission) => void;
  onParticipantChange: (uid: string, participant: boolean) => void;
  searchLoading?: boolean;
}

/** Renders the people tab for a trip. */
export function TripPeopleTab({
  people,
  searchResults,
  onSearch,
  onAdd,
  onAddParticipant,
  onRemove,
  onPermissionChange,
  onParticipantChange,
  searchLoading,
}: TripPeopleTabProps) {
  return (
    <PeopleSection
      people={people}
      searchResults={searchResults}
      onSearch={onSearch}
      onAdd={onAdd}
      onAddParticipant={onAddParticipant}
      onRemove={onRemove}
      onPermissionChange={onPermissionChange}
      onParticipantChange={onParticipantChange}
      searchLoading={searchLoading}
    />
  );
}
