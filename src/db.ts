import Dexie, { type Table } from "dexie";
import type { Layer } from "@features/atlas/layers";
import type { Marker } from "@features/atlas/markers/types";

export class AppDB extends Dexie {
  layers!: Table<Layer, string>; 
  markers!: Table<Marker, string>; 
  settings!: Table<Record<string, unknown>, string>;

  constructor(dbName = "AppDB") {
    super(dbName);
    this.version(5).stores({      
      layers: "id",
      markers: "id",
      settings: "id",
    });
  }
}

export const appDb = new AppDB();
