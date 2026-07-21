import { getDoc, getDocs, collection } from "firebase/firestore";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as auth from "./auth";
import {
  getCollection,
  getDocData,
  getDocsData,
  getUserCollection,
} from "./firestore";

vi.mock("firebase/firestore");
vi.mock("./auth");
vi.mock("@app/firebase", () => ({ db: {} }));

describe("firestore utils", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getCollection", () => {
    it("returns a collection reference", () => {
      const path = "testCollection";
      const colRef = { id: "mockColRef" };
      vi.mocked(collection).mockReturnValue(colRef as any);
      const result = getCollection(path);
      expect(result).toBe(colRef);
    });
  });

  describe("getUserCollection", () => {
    it("throws if not authenticated", () => {
      vi.spyOn(auth, "getCurrentUser").mockReturnValue(null);
      expect(() => getUserCollection("trips")).toThrow("Not authenticated");
    });

    it("returns collection ref when authenticated", () => {
      vi.spyOn(auth, "getCurrentUser").mockReturnValue({ uid: "123" } as any);
      getUserCollection("trips");
      expect(collection).toHaveBeenCalledWith(
        expect.anything(),
        "users",
        "123",
        "trips",
      );
    });
  });

  describe("getDocData", () => {
    it("returns data if exists", async () => {
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => ({ foo: "bar" }),
      } as any);
      const res = await getDocData({} as any);
      expect(res).toEqual({ foo: "bar" });
    });

    it("returns null if not exists", async () => {
      vi.mocked(getDoc).mockResolvedValue({ exists: () => false } as any);
      expect(await getDocData({} as any)).toBeNull();
    });
  });

  describe("getDocsData", () => {
    it("maps snapshot docs to typed objects", async () => {
      vi.mocked(getDocs).mockResolvedValue({
        docs: [{ id: "doc1", data: () => ({ val: 1 }) }],
      } as any);

      const res = await getDocsData({} as any);
      expect(res).toEqual([{ id: "doc1", val: 1 }]);
    });
  });
});
