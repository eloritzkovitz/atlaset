import Dexie, { type Table } from "dexie";
import type { CountryList } from "@features/countries/types";
import type { Layer } from "@features/atlas/layers";
import type { Marker } from "@features/atlas/markers/types";

export class AppDB extends Dexie {
  countryLists!: Table<CountryList, string>;
  layers!: Table<Layer, string>;
  markers!: Table<Marker, string>;
  settings!: Table<Record<string, unknown>, string>;

  constructor(dbName = "AppDB") {
    super(dbName);
    this.version(6).stores({
      countryLists: "id",
      layers: "id",
      markers: "id",
      settings: "id",
    });
  }
}

export const appDb = new AppDB();
