import { writeBatch, doc } from "firebase/firestore";
import { appDb } from "@lib/db";
import { db, getDocsData, isAuthenticated } from "@lib/firebase";
import { BaseService } from "@services/BaseService";
import type { Marker } from "../types";

/** Service for managing markers. */
export class MarkersService extends BaseService<Marker, typeof appDb.markers> {
  protected readonly collectionName = "markers";
  protected readonly localTable = appDb.markers;

  /** Loads all markers and sorts them by order. */
  async load(): Promise<Marker[]> {
    const markers = await super.load();
    return markers.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  /** Saves all markers, replacing existing ones. */
  async save(markers: Marker[]): Promise<void> {
    if (!markers) return;

    if (isAuthenticated()) {
      const batch = writeBatch(db);
      const colRef = this.getColRef();

      const existingMarkers = await getDocsData<Marker>(colRef);
      existingMarkers.forEach((m) => batch.delete(doc(colRef, m.id)));

      markers.forEach((m) => batch.set(doc(colRef, m.id), m));

      await batch.commit();
    } else if (this.localTable) {
      await this.localTable.clear();
      if (markers.length > 0) {
        await this.localTable.bulkPut(markers);
      }
    }
  }

  /** Update markers' order field specifically. */
  async reorder(markers: Marker[]): Promise<void> {
    if (!markers || markers.length === 0) return;

    if (isAuthenticated()) {
      const batch = writeBatch(db);
      const colRef = this.getColRef();

      markers.forEach((m) =>
        batch.update(doc(colRef, m.id), { order: m.order }),
      );
      await batch.commit();
    } else {
      for (const m of markers) {
        await this.localTable.update(m.id, { order: m.order });
      }
    }
  }
}

export const markersService = new MarkersService();
