import { useCallback } from "react";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useDisclosure } from "@hooks";
import { useTrips } from "../../core/context/TripsContext";
import type { Trip, TripShares } from "../../core/types";
import { canEditTrip } from "../../core/utils/tripPermissions";

const emptyTrip: Trip = {
  id: "",
  name: "",
  startDate: undefined,
  endDate: undefined,
  countryCodes: [],
  fullDays: 1,
  notes: "",
};

/**
 * Manages the state and handlers for creating and editing trips.
 */
export function useTripEditor() {
  const { user: currentUser } = useAuth();
  const { addTrip, editTrip, trips, sharedTrips } = useTrips();

  const modal = useDisclosure<Trip>();

  // Add a trip
  const handleAdd = useCallback(() => {
    modal.open({ ...emptyTrip });
  }, [modal]);

  // Edit a trip
  const handleEdit = useCallback(
    (selectedTrip: Trip) => {
      if (!currentUser) return;

      const sharedTrip = sharedTrips.find(
        (sharedTrip) => sharedTrip.tripId === selectedTrip.id,
      );

      const canEdit = canEditTrip(
        selectedTrip,
        currentUser.uid,
        sharedTrip?.ownerUid ?? currentUser.uid,
        sharedTrip,
      );

      if (!canEdit) return;

      modal.open({ ...selectedTrip });
    },
    [modal, sharedTrips, currentUser],
  );

  // Save a trip (either add or edit)
  const handleSave = useCallback(
    async (trip: Trip, shares: TripShares) => {
      // Check if ID exists in trips context or if it's a new trip
      const isExisting =
        Boolean(trip.id) && trips.some((item) => item.id === trip.id);

      if (isExisting) {
        await editTrip(trip, false, shares);
      } else {
        await addTrip({ ...trip, id: crypto.randomUUID() }, shares);
      }

      modal.close();
    },
    [modal, trips, addTrip, editTrip],
  );

  return {
    isOpen: modal.isOpen,
    trip: modal.data,
    setTrip: modal.setData,
    handleAdd,
    handleEdit,
    handleSave,
    onClose: modal.close,
  };
}
