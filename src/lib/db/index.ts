import Dexie, { type Table } from "dexie";
import type { CountryList } from "@features/atlas/countries/types";
import type { Layer } from "@features/atlas/layers/types";
import type { Marker } from "@features/atlas/markers/types";
import type { Settings } from "@features/settings/types";

export class AppDB extends Dexie {
  countryLists!: Table<CountryList, string>;
  layers!: Table<Layer, string>;
  markers!: Table<Marker, string>;
  settings!: Table<Settings, string>;

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
