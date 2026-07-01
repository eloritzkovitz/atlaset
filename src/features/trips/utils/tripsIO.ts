/**
 * Utility functions for importing and exporting trips data.
 */

import Papa from "papaparse";
import { exportToFile } from "@utils/json";
import type { Trip } from "../types";

/**
 * Imports trips from a given file (JSON or CSV) and adds them using the provided addTrip function.
 * @param file - The file to import trips from.
 * @param addTrip - The function to call to add each trip.
 */
export async function importTripsFromFile(
  file: File,
  addTrip: (trip: Trip) => Promise<void>,
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
 */
export function exportTripsToCSV(trips: Trip[]) {
  if (!trips.length) return;

  const headers = Object.keys(trips[0])
    .filter((key) => key !== "id")
    .join(",");
  const rows = trips.map((trip) =>
    Object.entries(trip)
      .filter(([key]) => key !== "id")
      .map(([val]) => `"${String(val).replace(/"/g, '""')}"`)
      .join(","),
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
 */
export function exportTripsToJSON(trips: Trip[]) {
  exportToFile(trips, "trips.json", ["id"]);
}
