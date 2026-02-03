import { describe, it, beforeEach, expect, vi } from "vitest";

vi.mock("@utils/firebase", () => {
  return {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    __esModule: true,
  };
});
vi.mock("firebase/firestore", () => {
  return {
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    __esModule: true,
  };
});
vi.mock("../../../../firebase", () => ({
  db: {},
  __esModule: true,
}));
vi.mock("@features/user", () => ({
  logUserActivity: vi.fn(),
  __esModule: true,
}));

import * as firebaseUtils from "@utils/firebase";
import * as firestore from "firebase/firestore";
import { logUserActivity } from "@features/user";
import { exportSaveService } from "./exportSaveService";
import type { SavedMap } from "../types";

const isAuthenticatedMock =
  firebaseUtils.isAuthenticated as unknown as ReturnType<typeof vi.fn>;
const getCurrentUserMock =
  firebaseUtils.getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const collectionMock = firestore.collection as unknown as ReturnType<
  typeof vi.fn
>;
const docMock = firestore.doc as unknown as ReturnType<typeof vi.fn>;
const getDocsMock = firestore.getDocs as unknown as ReturnType<typeof vi.fn>;
const setDocMock = firestore.setDoc as unknown as ReturnType<typeof vi.fn>;
const deleteDocMock = firestore.deleteDoc as unknown as ReturnType<
  typeof vi.fn
>;

describe("exportSaveService", () => {
  const mockUser = { uid: "user123", displayName: "Test User" };
  const mockMap: SavedMap = {
    id: "map1",
    name: "Test Map",
    layers: [{ name: "Layer1", color: "#fff", countries: ["US"] }],
    markers: [
      {
        name: "Marker1",
        coordinates: [0, 0],
        color: "#000",
        description: "desc",
      },
    ],
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    isAuthenticatedMock.mockReset();
    getCurrentUserMock.mockReset();
    collectionMock.mockReset();
    docMock.mockReset();
    getDocsMock.mockReset();
    setDocMock.mockReset();
    deleteDocMock.mockReset();
    vi.mocked(logUserActivity).mockReset();
    isAuthenticatedMock.mockReturnValue(true);
    getCurrentUserMock.mockReturnValue(mockUser);
  });

  it("should add a saved map for authenticated user", async () => {
    await expect(exportSaveService.add(mockMap)).resolves.not.toThrow();
    expect(setDocMock).toHaveBeenCalled();
    expect(logUserActivity).toHaveBeenCalledWith(
      310,
      expect.objectContaining({ mapId: mockMap.id }),
      mockUser.uid,
    );
  });

  it("should throw if not authenticated on add", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(exportSaveService.add(mockMap)).rejects.toThrow();
  });

  it("should delete a saved map for authenticated user", async () => {
    await expect(exportSaveService.delete(mockMap.id)).resolves.not.toThrow();
    expect(deleteDocMock).toHaveBeenCalled();
    expect(logUserActivity).toHaveBeenCalledWith(
      311,
      expect.objectContaining({ mapId: mockMap.id }),
      mockUser.uid,
    );
  });

  it("should throw if not authenticated on delete", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(exportSaveService.delete(mockMap.id)).rejects.toThrow();
  });

  it("should load saved maps for authenticated user", async () => {
    const mockDocs = [{ id: mockMap.id, data: () => ({ ...mockMap }) }];
    getDocsMock.mockResolvedValue({ docs: mockDocs });
    const result = await exportSaveService.load();
    expect(result).toEqual([
      expect.objectContaining({ id: mockMap.id, name: mockMap.name }),
    ]);
  });

  it("should throw if not authenticated on load", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(exportSaveService.load()).rejects.toThrow();
  });
});
