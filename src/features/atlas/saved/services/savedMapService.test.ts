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
    collection: vi.fn(() => ({ __collection: true })),
    doc: vi.fn(() => ({ __doc: true })),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
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
import { savedMapsService } from "./savedMapsService";
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
const getDocMock = vi.mocked(firestore.getDoc);

describe("savedMapsService", () => {
  const mockUser = { uid: "user123", displayName: "Test User" };
  const mockMap: SavedMap = {
    id: "map1",
    name: "Test Map",
    layers: [
      {
        id: "layer1",
        name: "Layer1",
        color: "#fff",
        countries: ["US"],
        visible: true,
      },
    ],
    markers: [
      {
        id: "marker1",
        name: "Marker1",
        coordinates: [0, 0],
        color: "#000",
        description: "desc",
        visible: true,
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
    await expect(savedMapsService.add(mockMap)).resolves.not.toThrow();
    expect(setDocMock).toHaveBeenCalledWith(expect.anything(), mockMap);
    expect(logUserActivity).toHaveBeenCalledWith(
      331,
      expect.objectContaining({ mapId: mockMap.id }),
      mockUser.uid,
    );
  });

  it("should set (create/update) a saved map for authenticated user", async () => {
    await expect(savedMapsService.set(mockMap)).resolves.not.toThrow();
    expect(setDocMock).toHaveBeenCalledWith(expect.anything(), mockMap, {
      merge: true,
    });
    expect(logUserActivity).toHaveBeenCalledWith(
      332,
      expect.objectContaining({ mapId: mockMap.id }),
      mockUser.uid,
    );
  });

  it("should throw if not authenticated on set", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(savedMapsService.set(mockMap)).rejects.toThrow();
  });

  it("should get a saved map for authenticated user", async () => {
    const mockSnapshot = {
      exists: () => true,
      id: mockMap.id,
      data: () => ({ ...mockMap }),
    };
    getDocMock.mockResolvedValue(mockSnapshot as any);
    const result = await savedMapsService.get(mockMap.id);
    expect(result).toEqual(
      expect.objectContaining({ id: mockMap.id, name: mockMap.name }),
    );
  });

  it("should return null if map does not exist on get", async () => {
    const mockSnapshot = {
      exists: () => false,
    };
    getDocMock.mockResolvedValue(mockSnapshot as any);
    const result = await savedMapsService.get("nonexistent");
    expect(result).toBeNull();
  });

  it("should throw if not authenticated on get", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(savedMapsService.get(mockMap.id)).rejects.toThrow();
  });

  it("should throw if not authenticated on add", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(savedMapsService.add(mockMap)).rejects.toThrow();
  });

  it("should delete a saved map for authenticated user", async () => {
    await expect(savedMapsService.delete(mockMap.id)).resolves.not.toThrow();
    expect(deleteDocMock).toHaveBeenCalled();
    expect(logUserActivity).toHaveBeenCalledWith(
      333,
      expect.objectContaining({ mapId: mockMap.id }),
      mockUser.uid,
    );
  });

  it("should throw if not authenticated on delete", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(savedMapsService.delete(mockMap.id)).rejects.toThrow();
  });

  it("should load saved maps for authenticated user", async () => {
    const mockDocs = [{ id: mockMap.id, data: () => ({ ...mockMap }) }];
    getDocsMock.mockResolvedValue({ docs: mockDocs });
    const result = await savedMapsService.load();
    expect(result).toEqual([
      expect.objectContaining({ id: mockMap.id, name: mockMap.name }),
    ]);
  });

  it("should throw if not authenticated on load", async () => {
    isAuthenticatedMock.mockReturnValue(false);
    await expect(savedMapsService.load()).rejects.toThrow();
  });
});
