import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useFriendProfiles } from "@features/user/friends/hooks/useFriendProfiles";
import { useUserFriends } from "@features/user/friends/hooks/useUserFriends";
import { useUserSearch } from "@features/search/hooks/useUserSearch";
import type { UserSearchResult } from "@features/search/types";
import type { Permission } from "@features/user/permissions/types";
import type { UserProfile } from "@features/user/profile";
import type { SharedTrip, TripPerson } from "../types";
import type { Trip } from "../../core/types";

interface UseTripPeopleOptions {
  trip: Trip | null;
  isOpen: boolean;
  isEditing: boolean;
}

/**
 * Manages participation and access permissions for a trip.
 */
export function useTripPeople({
  trip,
  isOpen,
  isEditing,
}: UseTripPeopleOptions) {
  const { user } = useAuth();
  const { friends } = useUserFriends();

  const [tripShares, setTripShares] = useState<Map<string, SharedTrip>>(
    new Map(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const friendUids = useMemo(
    () => friends.map((friend) => friend.uid),
    [friends],
  );

  const { profiles: friendProfiles } = useFriendProfiles(friendUids);

  const { results: userSearchResults, loading: searchLoading } = useUserSearch(
    searchQuery,
    user?.uid,
    friendUids,
  );

  // Initialize trip shares when the modal opens or the trip changes
  useEffect(() => {
    if (!isOpen || !isEditing || !trip || !user) {
      setTripShares(new Map());
      return;
    }

    const shares = new Map<string, SharedTrip>();

    for (const uid of trip.sharedWith ?? []) {
      shares.set(uid, {
        ownerUid: user.uid,
        tripId: trip.id,
        type: trip.participants?.includes(uid) ? "participant" : "shared",
        permission: "viewer",
      });
    }

    setTripShares(shares);
  }, [isOpen, isEditing, trip, user]);

  const people = useMemo<TripPerson[]>(() => {
    if (!trip) {
      return [];
    }

    const participants = new Set(trip.participants ?? []);
    const result: TripPerson[] = [];

    for (const uid of trip.sharedWith ?? []) {
      const profile = friendProfiles.find((item) => item.uid === uid);

      if (!profile) {
        continue;
      }

      const sharedTrip = tripShares.get(uid);

      result.push({
        profile,
        sharedTrip: {
          ownerUid: sharedTrip?.ownerUid ?? "",
          tripId: trip.id,
          type: participants.has(uid) ? "participant" : "shared",
          permission: sharedTrip?.permission ?? "viewer",
        },
      });
    }

    return result;
  }, [trip, tripShares, friendProfiles]);

  const searchResults = useMemo<UserProfile[]>(() => {
    const existingUids = new Set(people.map((person) => person.profile.uid));

    return (userSearchResults as UserSearchResult[])
      .filter((result) => !existingUids.has(result.uid))
      .map((result) => ({ ...result }) as UserProfile);
  }, [userSearchResults, people]);

  /** Adds a person to the trip and updates the trip shares state. */
  function addPerson(profile: UserProfile, onChange: (trip: Trip) => void) {
    if (!trip || !user) {
      return;
    }

    const sharedWith = new Set(trip.sharedWith ?? []);
    sharedWith.add(profile.uid);

    setTripShares((previous) => {
      const next = new Map(previous);

      next.set(profile.uid, {
        ownerUid: user.uid,
        tripId: trip.id,
        type: "shared",
        permission: "viewer",
      });

      return next;
    });

    onChange({
      ...trip,
      sharedWith: Array.from(sharedWith),
    });
  }

  /** Adds a person as a participant and gives them access to the trip. */
  function addParticipant(
    profile: UserProfile,
    onChange: (trip: Trip) => void,
  ) {
    if (!trip || !user) {
      return;
    }

    const sharedWith = new Set(trip.sharedWith ?? []);
    sharedWith.add(profile.uid);

    const participants = new Set(trip.participants ?? []);
    participants.add(profile.uid);

    setTripShares((previous) => {
      const next = new Map(previous);

      next.set(profile.uid, {
        ownerUid: user.uid,
        tripId: trip.id,
        type: "participant",
        permission: "viewer",
      });

      return next;
    });

    onChange({
      ...trip,
      sharedWith: Array.from(sharedWith),
      participants: Array.from(participants),
    });
  }

  /** Removes a person from the trip and updates the trip shares state. */
  function removePerson(uid: string, onChange: (trip: Trip) => void) {
    if (!trip) {
      return;
    }

    setTripShares((previous) => {
      const next = new Map(previous);
      next.delete(uid);
      return next;
    });

    onChange({
      ...trip,
      sharedWith: (trip.sharedWith ?? []).filter(
        (sharedUid) => sharedUid !== uid,
      ),
      participants: (trip.participants ?? []).filter(
        (participantUid) => participantUid !== uid,
      ),
    });
  }

  /** Updates the permission of a person in the trip. */
  function updatePermission(uid: string, permission: Permission) {
    setTripShares((previous) => {
      const current = previous.get(uid);

      if (!current) {
        return previous;
      }

      const next = new Map(previous);

      next.set(uid, {
        ...current,
        permission,
      });

      return next;
    });
  }

  /** Handles the change of a participant in the trip. */
  function handleParticipantChange(
    uid: string,
    participant: boolean,
    onChange: (trip: Trip) => void,
  ) {
    if (!trip) {
      return;
    }

    setTripShares((previous) => {
      const current = previous.get(uid);

      if (!current) {
        return previous;
      }

      const next = new Map(previous);

      next.set(uid, {
        ...current,
        type: participant ? "participant" : "shared",
      });

      return next;
    });

    const participants = new Set(trip.participants ?? []);

    if (participant) {
      participants.add(uid);
    } else {
      participants.delete(uid);
    }

    onChange({
      ...trip,
      participants: Array.from(participants),
    });
  }

  /** Searches for people based on the query. */
  function search(query: string) {
    setSearchQuery(query);
  }

  /** Clears the search query. */
  function clearSearch() {
    setSearchQuery("");
  }

  return {
    people,
    searchResults,
    searchQuery,
    search,
    clearSearch,
    addPerson,
    addParticipant,
    removePerson,
    updatePermission,
    handleParticipantChange,
    tripShares,
    searchLoading,
  };
}
