import Dexie, { type Table } from "dexie";
import type { Layer } from "@features/atlas/layers";
import type { Marker } from "@features/atlas/markers/types";
import type { Trip } from "@features/trips";

export class AppDB extends Dexie {
  layers!: Table<Layer, string>; 
  markers!: Table<Marker, string>; 
  trips!: Table<Trip, string>;
  settings!: Table<Record<string, unknown>, string>;

  constructor(dbName = "AppDB") {
    super(dbName);
    this.version(4).stores({      
      layers: "id",
      markers: "id",
      trips: "id",
      settings: "id",
    });
  }
}

export const appDb = new AppDB();
