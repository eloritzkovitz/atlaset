import { useCallback, useState } from "react";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { useDisclosure } from "@hooks";
import { useTrips } from "../../core/context/TripsContext";
import type { Trip } from "../../core/types";
import type { TripModalMode } from "../components/TripModal";
import type { TripOverrides, TripShares } from "../../sharing/types";
import { canEditTrip } from "../../sharing/utils/tripPermissions";

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
  const { sharedTrips, addTrip, editTrip, saveTripOverrides } = useTrips();

  const modal = useDisclosure<Trip>();
  const [mode, setMode] = useState<TripModalMode>("add");
  const [customOverrides, setCustomOverrides] = useState<
    TripOverrides | undefined
  >();

  // Add a trip
  const handleAdd = useCallback(() => {
    setMode("add");
    setCustomOverrides(undefined);
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

      setMode("edit");
      setCustomOverrides(undefined);
      modal.open({ ...selectedTrip });
    },
    [modal, sharedTrips, currentUser],
  );

  // Customize a trip (for shared trips)
  const handleCustomize = useCallback(
    (selectedTrip: Trip) => {
      const sharedTrip = sharedTrips.find(
        (sharedTrip) => sharedTrip.tripId === selectedTrip.id,
      );

      setMode("custom");
      setCustomOverrides(sharedTrip?.overrides);
      modal.open({ ...selectedTrip });
    },
    [modal, sharedTrips],
  );

  // Save a trip (either add or edit)
  const handleSave = useCallback(
    async (trip: Trip, shares: TripShares) => {
      if (mode === "edit") {
        await editTrip(trip, false, shares);
      } else {
        await addTrip({ ...trip, id: crypto.randomUUID() }, shares);
      }

      modal.close();
    },
    [mode, modal, addTrip, editTrip],
  );

  // Save custom trip overrides
  const handleSaveOverrides = useCallback(
    async (overrides: TripOverrides) => {
      if (!modal.data) return;

      await saveTripOverrides(modal.data.id, overrides);

      setCustomOverrides(overrides);
      modal.close();
    },
    [modal, saveTripOverrides],
  );

  return {
    isOpen: modal.isOpen,
    trip: modal.data,
    mode,
    overrides: customOverrides,
    setTrip: modal.setData,
    handleAdd,
    handleEdit,
    handleCustomize,
    handleSave,
    handleSaveOverrides,
    onClose: modal.close,
  };
}
