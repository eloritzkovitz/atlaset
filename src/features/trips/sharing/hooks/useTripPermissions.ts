import { useAuth } from "@features/user/auth/hooks/useAuth";
import { isTripEditor, canEditTrip } from "../utils/tripPermissions";
import { useTrips } from "../../core/context/TripsContext";
import type { Trip } from "../../core/types";

/**
 * Provides the current user's permissions for a trip.
 */
export function useTripPermissions(trip: Trip | undefined) {
  const { user } = useAuth();
  const { sharedTrips } = useTrips();

  const sharedTrip = trip
    ? sharedTrips.find((item) => item.tripId === trip.id)
    : undefined;

  const ownerUid = sharedTrip?.ownerUid ?? user?.uid;

  const isOwner =
    user !== null && ownerUid !== undefined && user.uid === ownerUid;

  const isEditor = !isOwner && isTripEditor(sharedTrip);

  const canEdit =
    trip !== undefined &&
    user !== null &&
    ownerUid !== undefined &&
    canEditTrip(trip, user.uid, ownerUid, sharedTrip);

  return {
    isOwner,
    isEditor,
    canEdit,
  };
}
