import type { UserProfile } from "@features/user/profile/types";
import type { SharedTrip } from "../core/types";

/** Represents a person associated with a trip. */
export type TripPerson = {
  profile: UserProfile;
  sharedTrip: SharedTrip;
};
