/**
 * Utility functions for importing and exporting trips data.
 */

import Papa from "papaparse";
import type { Trip } from "@types";

/**
 * Imports trips from a given file (JSON or CSV) and adds them using the provided addTrip function.
 * @param file - The file to import trips from.
 * @param addTrip - The function to call to add each trip.
 * @returns void
 */
export async function importTripsFromFile(
  file: File,
  addTrip: (trip: Trip) => Promise<void>
) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const text = await file.text();

  if (ext === "json") {
    try {
      const trips = JSON.parse(text);
      for (const trip of trips) {
        await addTrip({ ...trip, id: crypto.randomUUID() });
      }
    } catch {
      alert("Invalid JSON file.");
    }
  } else if (ext === "csv") {
    Papa.parse(text, {
      header: true,
      complete: async (results) => {
        for (const trip of results.data as unknown[]) {
          await addTrip({ ...(trip as Trip), id: crypto.randomUUID() });
        }
      },
    });
  } else {
    alert("Unsupported file type.");
  }
}

/**
 * Exports an array of trips to a CSV file and triggers a download.
 * @param trips - The array of trips to export.
 * @returns void
 */
export function exportTripsToCSV(trips: Trip[]) {
  const tripsNoId = trips.map(({ ...rest }) => rest);
  const headers = Object.keys(tripsNoId[0] || {}).join(",");
  const rows = tripsNoId.map((trip) =>
    Object.values(trip)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trips.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports an array of trips to a JSON file and triggers a download.
 * @param trips - The array of trips to export.
 * @returns void
 */
export function exportTripsToJSON(trips: Trip[]) {
  const tripsNoId = trips.map(({ ...rest }) => rest);
  const json = JSON.stringify(tripsNoId, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trips.json";
  a.click();
  URL.revokeObjectURL(url);
}
