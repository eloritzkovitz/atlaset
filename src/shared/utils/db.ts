import Dexie, { type Table } from "dexie";
import type { Marker } from "@features/atlas/markers/types";
import type { Overlay } from "@features/atlas/overlays";
import type { Trip } from "@features/trips";

export class AppDB extends Dexie {
  countryData!: Table<Record<string, unknown>, string>;
  currencyData!: Table<Record<string, unknown>, string>;
  geoData!: Table<Record<string, unknown>, string>;
  trips!: Table<Trip, string>;
  markers!: Table<Marker, string>;
  overlays!: Table<Overlay, string>;
  settings!: Table<Record<string, unknown>, string>;

  constructor(dbName = "AppDB") {
    super(dbName);
    this.version(2).stores({
      countryData: "id",
      currencyData: "id",
      geoData: "id",
      trips: "id",
      markers: "id",
      overlays: "id",
      settings: "id",
    });
  }
}

export const appDb = new AppDB();
