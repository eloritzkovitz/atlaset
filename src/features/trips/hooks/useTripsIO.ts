import { useRef } from "react";
import type { Trip } from "../types";
import {
  exportTripsToCSV,
  exportTripsToJSON,
  importTripsFromFile,
} from "../utils/tripsIO";

export function useTripIO(trips: Trip[], addTrip: (trip: Trip) => void) {
  const fileInputRef = useRef<HTMLInputElement>(null);    

  // File change handler
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await importTripsFromFile(file, async (trip: Trip) => {
      addTrip(trip);
    });    
    e.target.value = "";
  }  

  // Export to CSV handler
  function handleExportCSV() {
    exportTripsToCSV(trips);
    
  }

  // Export to JSON handler
  function handleExportJSON() {
    exportTripsToJSON(trips);
  }  

  return {    
    fileInputRef,
    handleFileChange,    
    handleExportCSV,
    handleExportJSON,
  };
}
