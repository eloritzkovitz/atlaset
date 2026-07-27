import { doc, writeBatch } from "firebase/firestore";
import { appDb } from "@lib/db";
import { db, getDocsData, isAuthenticated } from "@lib/firebase";
import { BaseService } from "@services/BaseService";
import type { AnyLayer } from "../types";

/** Service for managing layers. */
export class LayersService extends BaseService<AnyLayer, typeof appDb.layers> {
  protected readonly collectionName = "layers";
  protected readonly localTable = appDb.layers;

  /** Loads all layers and sorts them by order. */
  async load(): Promise<AnyLayer[]> {
    const layers = await super.load();
    return layers.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  /** Saves all layers, replacing existing ones. */
  async save(layers: AnyLayer[]): Promise<void> {
    if (!layers?.length) return;

    if (isAuthenticated()) {
      const batch = writeBatch(db);
      const colRef = this.getColRef();

      const existingLayers = await getDocsData<AnyLayer>(colRef);
      existingLayers.forEach((l) => batch.delete(doc(colRef, l.id)));

      layers.forEach((l) => batch.set(doc(this.getColRef(), l.id), l));

      await batch.commit();
    } else {
      await this.localTable.clear();
      await this.localTable.bulkPut(layers);
    }
  }

  /** Update layers' order field specifically. */
  async reorder(layers: AnyLayer[]): Promise<void> {
    if (!layers?.length) return;

    if (isAuthenticated()) {
      const batch = writeBatch(db);
      layers.forEach((l) =>
        batch.update(doc(this.getColRef(), l.id), { order: l.order }),
      );
      await batch.commit();
    } else {
      for (const l of layers) {
        await this.localTable.update(l.id, { order: l.order });
      }
    }
  }
}

export const layersService = new LayersService();
