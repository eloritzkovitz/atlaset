import type { Permission } from "@features/user/permissions/types";
import type { UserProfile } from "@features/user/profile/types";

/** The type of a shared trip. */
export type SharedTripType = "participant" | "shared";

/** Represents a shared trip reference. */
export type SharedTrip = {
  ownerUid: string;
  tripId: string;
  type?: SharedTripType;
  permission?: Permission;
};

/** Represents trip share drafts keyed by recipient UID. */
export type TripShares = ReadonlyMap<string, SharedTrip>;

/** Represents a person associated with a trip. */
export type TripPerson = {
  profile: UserProfile;
  sharedTrip: SharedTrip;
};
