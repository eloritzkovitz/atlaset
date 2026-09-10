import Dexie, { type Table } from "dexie";

import type { CountryList } from "@features/atlas/countries/types";
import type { Layer } from "@features/atlas/layers/types";
import type { Marker } from "@features/atlas/markers/types";
import type { Settings } from "@features/settings/types";
import type { Location } from "@lib/locations/types";

export class AppDB extends Dexie {
  countryLists!: Table<CountryList, string>;
  layers!: Table<Layer, string>;
  markers!: Table<Marker, string>;
  settings!: Table<Settings, string>;
  locations!: Table<Location, number>;

  constructor(dbName = "AppDB") {
    super(dbName);

    this.version(7).stores({
      countryLists: "id",
      layers: "id",
      markers: "id",
      settings: "id",
      locations: "id",
    });
  }
}

export const appDb = new AppDB();
