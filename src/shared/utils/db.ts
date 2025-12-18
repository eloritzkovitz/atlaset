import Dexie, { type Table } from "dexie";
import type { Trip } from "../types";
import type { Marker } from "../types/marker";
import type { Overlay } from "../types/overlay";

export class AppDB extends Dexie {
  countryData!: Table<any, string>;
  currencyData!: Table<any, string>;
  geoData!: Table<any, string>;
  trips!: Table<Trip, string>;
  markers!: Table<Marker, string>;
  overlays!: Table<Overlay, string>;
  settings!: Table<any, string>;

  constructor(dbName = "AppDB") {
    super(dbName);
    this.version(1).stores({
      countryData: "id",
      currencyData: "id",
      geoData: "id",
      trips: "id",
      markers: "id",
      overlays: "id",
      settings: 'id',      
    });
  }
}

export const appDb = new AppDB();
