import { useCallback } from "react";
import { useTrips } from "@contexts/TripsContext";
import { useDisclosure } from "@hooks";
import type { Trip } from "../types";

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
 * Manages the state and handlers for the Trip modal.
 * @returns State and handlers for the Trip modal
 */
export function useTripModal() {
  const { addTrip, editTrip, trips } = useTrips();

  const modal = useDisclosure<Trip>();

  // Add a trip
  const handleAdd = useCallback(() => {
    modal.open({ ...emptyTrip });
  }, [modal]);

  // Edit a trip
  const handleEdit = useCallback(
    (selectedTrip: Trip) => {
      modal.open({ ...selectedTrip });
    },
    [modal],
  );

  // Save a trip (either add or edit)
  const handleSave = useCallback(async () => {
    const trip = modal.data;
    if (!trip) return;

    // Check if ID exists in trips context or if it's a new trip
    const isExisting = Boolean(trip.id) && trips.some((t) => t.id === trip.id);

    if (isExisting) {
      editTrip(trip);
    } else {
      addTrip({ ...trip, id: crypto.randomUUID() });
    }

    modal.close();
  }, [modal, trips, addTrip, editTrip]);

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
