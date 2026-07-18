import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  CollectionReference,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { isAuthenticated, getUserCollection } from "@lib/firebase";

export interface BaseEntity {
  id: string;
  name?: string;
}

/** Represents a local table for managing entities. */
export interface LocalTable<T> {
  toArray: () => Promise<T[]>;
  add: (item: T) => Promise<unknown>;
  put: (item: T) => Promise<unknown>;
  delete: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  bulkPut: (items: T[]) => Promise<unknown>;
  update: (id: string, changes: Partial<T>) => Promise<number>;
}

/** Base service for managing entities in Firestore. */
export abstract class BaseService<T extends BaseEntity, TTable> {
  protected abstract readonly collectionName: string;
  protected abstract readonly localTable?: TTable & LocalTable<T>;

  /** Gets the collection reference. */
  protected getColRef(): CollectionReference {
    return getUserCollection(this.collectionName);
  }

  /** Loads all items from the collection. */
  async load(): Promise<T[]> {
    if (isAuthenticated()) {
      const snapshot = await getDocs(this.getColRef());
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    }
    return this.localTable ? await this.localTable.toArray() : [];
  }

  /** Adds a new item to the collection. */
  async add(item: T): Promise<void> {
    if (isAuthenticated()) {
      await setDoc(doc(this.getColRef(), item.id), item);
    } else if (this.localTable) {
      await this.localTable.add(item);
    } else {
      throw new Error("Authentication required for cloud-only entities.");
    }
  }

  /** Updates specific fields of an existing item. */
  async update(id: string, changes: Partial<T>): Promise<void> {
    if (isAuthenticated()) {
      await updateDoc(doc(this.getColRef(), id), changes as DocumentData);
    } else if (this.localTable) {
      await this.localTable.update(id, changes);
    } else {
      throw new Error("Authentication required for cloud-only entities.");
    }
  }

  /** Deletes an item from the collection. */
  async delete(id: string): Promise<void> {
    if (isAuthenticated()) {
      await deleteDoc(doc(this.getColRef(), id));
    } else if (this.localTable) {
      await this.localTable.delete(id);
    } else {
      throw new Error("Authentication required for cloud-only entities.");
    }
  }
}
