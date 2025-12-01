import {
  createDbMock,
  firestoreMocks,
  authMocks,
  resetAllMocks,
} from "@test-utils/mockDbAndFirestore";
import { overlaysService } from "./overlaysService";
import { vi } from "vitest";

// IndexedDB mock
vi.mock("@utils/db", () => {
  const overlaysMock = createDbMock([
    "toArray",
    "clear",
    "bulkAdd",
    "bulkPut",
    "add",
    "put",
    "delete",
  ]);
  return {
    appDb: { overlays: overlaysMock },
    __overlaysMock: overlaysMock,
  };
});

// Firebase Auth/User mocks
vi.mock("@utils/firebase", () => authMocks);

// Firestore mocks
vi.mock("firebase/firestore", () => firestoreMocks);
vi.mock("../../firebase", () => ({ db: {} }));

const { __overlaysMock: overlaysMock } = (await import("@utils/db")) as any;
const { isAuthenticated, getCurrentUser } = await import("@utils/firebase");
const { collection, doc, getDocs, setDoc, deleteDoc, writeBatch } =
  await import("firebase/firestore");

describe("overlaysService", () => {
  beforeEach(() => {
    resetAllMocks(overlaysMock, firestoreMocks, authMocks);
  });

  describe("guest (IndexedDB) path", () => {
    beforeEach(() => {
      (isAuthenticated as any).mockReturnValue(false);
    });

    it("loads overlays and adds visited overlay if missing", async () => {
      overlaysMock.toArray.mockResolvedValueOnce([]);
      const overlays = await overlaysService.load();
      expect(overlays[0].id).toBe("visited-countries");
      expect(overlays[0].name).toBe("Visited Countries");
    });

    it("loads overlays and does not add visited overlay if present", async () => {
      overlaysMock.toArray.mockResolvedValueOnce([
        { id: "visited-countries", name: "Visited Countries" },
      ]);
      const overlays = await overlaysService.load();
      expect(overlays[0].id).toBe("visited-countries");
      expect(overlays.length).toBe(1);
    });

    it("saves overlays", async () => {
      const overlays = [{ id: "foo" }];
      await overlaysService.save(overlays as any);
      expect(overlaysMock.clear).toHaveBeenCalled();
      expect(overlaysMock.bulkPut).toHaveBeenCalledWith(overlays);
    });

    it("adds an overlay", async () => {
      const overlay = { id: "bar" };
      await overlaysService.add(overlay as any);
      expect(overlaysMock.add).toHaveBeenCalledWith(overlay);
    });

    it("edits an overlay", async () => {
      const overlay = { id: "baz" };
      await overlaysService.edit(overlay as any);
      expect(overlaysMock.put).toHaveBeenCalledWith(overlay);
    });

    it("removes an overlay", async () => {
      await overlaysService.remove("baz");
      expect(overlaysMock.delete).toHaveBeenCalledWith("baz");
    });

    it("sorts overlays by order, treating missing order as 0", async () => {
      overlaysMock.toArray.mockResolvedValueOnce([
        { id: "a", order: 2 },
        { id: "b" }, // no order property
        { id: "c", order: 1 },
      ]);
      const overlays = await overlaysService.load();
      // After sorting, order should be: visited-countries, b (order 0), c (order 1), a (order 2)
      expect(overlays.map((o) => o.id)).toEqual([
        "visited-countries",
        "b",
        "c",
        "a",
      ]);
    });
  });

  describe("authenticated (Firestore) path", () => {
    beforeEach(() => {
      (isAuthenticated as any).mockReturnValue(true);
      (getCurrentUser as any).mockReturnValue({ uid: "abc" });
    });

    it("loads overlays from Firestore and adds visited overlay if missing", async () => {
      const overlaysCol = {};
      (collection as any).mockReturnValue(overlaysCol);
      (getDocs as any).mockResolvedValueOnce({
        docs: [
          { id: "x", data: () => ({ name: "Overlay X" }) },
          { id: "y", data: () => ({ name: "Overlay Y" }) },
        ],
      });
      const overlays = await overlaysService.load();
      expect(collection).toHaveBeenCalledWith({}, "users", "abc", "overlays");
      expect(getDocs).toHaveBeenCalledWith(overlaysCol);
      expect(overlays.some((o) => o.id === "visited-countries")).toBe(true);
      expect(overlays).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "x", name: "Overlay X" }),
          expect.objectContaining({ id: "y", name: "Overlay Y" }),
        ])
      );
    });

    it("saves overlays to Firestore", async () => {
      const overlaysCol = {};
      const batch = {
        delete: vi.fn(),
        set: vi.fn(),
        commit: vi.fn(),
      };
      (collection as any).mockReturnValue(overlaysCol);
      (writeBatch as any).mockReturnValue(batch);
      (getDocs as any).mockResolvedValueOnce({
        docs: [{ ref: "ref1" }, { ref: "ref2" }],
      });
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));

      const overlays = [{ id: "foo" }, { id: "bar" }];
      await overlaysService.save(overlays as any);

      expect(collection).toHaveBeenCalledWith({}, "users", "abc", "overlays");
      expect(writeBatch).toHaveBeenCalled();
      expect(batch.delete).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledTimes(2);
      expect(batch.set).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "foo" },
        overlays[0]
      );
      expect(batch.set).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "bar" },
        overlays[1]
      );
      expect(batch.commit).toHaveBeenCalled();
    });

    it("adds an overlay to Firestore", async () => {
      const overlaysCol = {};
      (collection as any).mockReturnValue(overlaysCol);
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
      const overlay = { id: "bar" };
      await overlaysService.add(overlay as any);
      expect(setDoc).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "bar" },
        overlay
      );
    });

    it("edits an overlay in Firestore", async () => {
      const overlaysCol = {};
      (collection as any).mockReturnValue(overlaysCol);
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
      const overlay = { id: "baz" };
      await overlaysService.edit(overlay as any);
      expect(setDoc).toHaveBeenCalledWith(
        { _col: overlaysCol, id: "baz" },
        overlay
      );
    });

    it("removes an overlay from Firestore", async () => {
      const overlaysCol = {};
      (collection as any).mockReturnValue(overlaysCol);
      (doc as any).mockImplementation((_col: any, id: any) => ({ _col, id }));
      await overlaysService.remove("baz");
      expect(deleteDoc).toHaveBeenCalledWith({ _col: overlaysCol, id: "baz" });
    });
  });
});
