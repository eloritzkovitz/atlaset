import { useState } from "react";
import { useTrips } from "@contexts/TripsContext";
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

  const [trip, setTrip] = useState<Trip | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Add trip
  function handleAdd() {
    setTrip({ ...emptyTrip });
    setModalOpen(true);
  }

  // Edit trip
  function handleEdit(selectedTrip: Trip) {
    setTrip({ ...selectedTrip });
    setModalOpen(true);
  }

  // Save trip (add or edit)
  async function handleSave() {
    if (!trip) return;
    if (!trip.id) {
      const newTrip = { ...trip, id: crypto.randomUUID() };
      addTrip(newTrip);
    } else if (trips.some((t) => t.id === trip.id)) {
      editTrip(trip);
    }
    setModalOpen(false);
  }

  return {
    trip,
    setTrip,
    modalOpen,
    setModalOpen,
    handleAdd,
    handleEdit,
    handleSave,
  };
}
