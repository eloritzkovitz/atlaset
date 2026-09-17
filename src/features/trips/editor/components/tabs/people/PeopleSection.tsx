import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  EmptyListMessage,
  LoadingSpinner,
  SearchInput,
  Separator,
} from "@components";
import { ICONS } from "@constants/icons";
import { SearchItem } from "@features/search";
import { UserAvatar, UserInfo } from "@features/user/core";
import type { UserProfile } from "@features/user/profile/types";
import {
  UserPermissionSelect,
  type Permission,
} from "@features/user/permissions";
import type { TripPerson } from "../../../../sharing/types";

interface PeopleSectionProps {
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

export function PeopleSection({
  people,
  searchResults,
  onSearch,
  onAdd,
  onAddParticipant,
  onRemove,
  onPermissionChange,
  onParticipantChange,
  searchLoading = false,
}: PeopleSectionProps) {
  const { t } = useTranslation("trips");
  const [query, setQuery] = useState("");

  const existingUids = new Set(people.map((person) => person.profile.uid));

  const filteredSearchResults = searchResults.filter(
    (profile) => !existingUids.has(profile.uid),
  );

  /** Handles changing the search query and triggering a new search. */
  function handleSearchChange(value: string) {
    setQuery(value);
    onSearch(value);
  }

  /** Handles adding a user to the trip and clearing the search input. */
  function handleAdd(profile: UserProfile) {
    onAdd(profile);
    setQuery("");
    onSearch("");
  }

  /** Handles adding a user as a participant and clearing the search input. */
  function handleAddParticipant(profile: UserProfile) {
    onAddParticipant(profile);
    setQuery("");
    onSearch("");
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      <SearchInput
        value={query}
        onChange={handleSearchChange}
        onClear={() => {
          setQuery("");
          onSearch("");
        }}
        placeholder={t("editor.people.searchPlaceholder")}
      />

      {query.trim() && (
        <div className="overflow-hidden rounded-lg">
          {searchLoading ? (
            <LoadingSpinner />
          ) : filteredSearchResults.length === 0 ? (
            <EmptyListMessage message={t("editor.people.noResults")} />
          ) : (
            <div className="divide-y divide-border">
              {filteredSearchResults.map((profile) => (
                <SearchItem
                  item={profile}
                  displayName={profile.displayName}
                  label={profile.username}
                  icon={<UserAvatar user={profile} size={32} />}
                  onClick={handleAdd}
                >
                  <ActionButton
                    icon={<ICONS.friendRequests />}
                    ariaLabel={t("editor.people.addParticipant")}
                    title={t("editor.people.addParticipant")}
                    onClick={() => handleAddParticipant(profile)}
                    rounded
                  />
                  <ActionButton
                    icon={<ICONS.share />}
                    ariaLabel={t("common:actions.share")}
                    title={t("common:actions.share")}
                    onClick={() => handleAdd(profile)}
                    rounded
                  />
                </SearchItem>
              ))}
            </div>
          )}
        </div>
      )}

      <Separator className="my-2" />

      {people.length === 0 ? (
        <EmptyListMessage
          message={t("editor.people.noPeople", "No people added yet.")}
        />
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {people.map(({ profile, sharedTrip }) => {
            const isParticipant = sharedTrip.type === "participant";

            return (
              <div
                key={profile.uid}
                className="flex items-center gap-3 py-2 w-full"
              >
                <div className="min-w-0 flex-1">
                  <UserInfo user={profile} showDisplayName showUsername />
                </div>

                <ActionButton
                  variant="toggle"
                  className={`shrink-0 rounded p-1.5 transition ${
                    isParticipant
                      ? "text-success hover:text-danger"
                      : "text-muted hover:text-text"
                  }`}
                  icon={<ICONS.profile />}
                  ariaLabel={
                    isParticipant
                      ? t("editor.people.removeParticipant")
                      : t("editor.people.markParticipant")
                  }
                  title={
                    isParticipant
                      ? t("editor.people.removeParticipant")
                      : t("editor.people.markParticipant")
                  }
                  onClick={() =>
                    onParticipantChange(profile.uid, !isParticipant)
                  }
                  rounded
                />

                <div className="w-28 shrink-0">
                  <UserPermissionSelect
                    permission={sharedTrip.permission ?? "viewer"}
                    onChange={(permission) =>
                      onPermissionChange(profile.uid, permission)
                    }
                  />
                </div>

                <ActionButton
                  icon={<ICONS.close />}
                  ariaLabel={t("common:actions.remove", "Remove")}
                  title={t("common:actions.remove", "Remove")}
                  onClick={() => onRemove(profile.uid)}
                  rounded
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
