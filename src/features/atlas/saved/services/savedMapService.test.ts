import { describe, it, beforeEach, expect, vi } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { savedMapsService } from "./savedMapsService";
import type { SavedMap } from "../types";
import { logUserActivity } from "../../../../features/user";

vi.mock("../../../../features/user", () => ({ logUserActivity: vi.fn() }));
vi.mock("@app/firebase", () => ({ db: {} }));

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
    vi.clearAllMocks();
    auth.isAuthenticated.mockReturnValue(true);
    auth.getCurrentUser.mockReturnValue(mockUser as unknown as any);
    fs.collection.mockReturnValue({
      id: "mock-collection",
      path: "mock-collection",
    });
    fs.query.mockImplementation((ref) => ref);
    fs.doc.mockImplementation((...args: any[]) => {
      const docId =
        typeof args[args.length - 1] === "string"
          ? args[args.length - 1]
          : "mock-doc-id";
      return { id: docId, path: `mock-path/${docId}` };
    });
  });

  describe("authenticated paths", () => {
    it("manages map additions, sets, and deletions cleanly alongside activity logging", async () => {
      await expect(savedMapsService.add(mockMap)).resolves.not.toThrow();
      expect(fs.setDoc).toHaveBeenCalledWith(expect.anything(), mockMap);
      expect(logUserActivity).toHaveBeenCalledWith(
        231,
        expect.objectContaining({ mapId: mockMap.id }),
        mockUser.uid,
      );

      await expect(savedMapsService.set(mockMap)).resolves.not.toThrow();
      expect(fs.setDoc).toHaveBeenCalledWith(expect.anything(), mockMap, {
        merge: true,
      });
      expect(logUserActivity).toHaveBeenCalledWith(
        232,
        expect.objectContaining({ mapId: mockMap.id }),
        mockUser.uid,
      );

      await expect(savedMapsService.delete(mockMap.id)).resolves.not.toThrow();
      expect(fs.deleteDoc).toHaveBeenCalled();
      expect(logUserActivity).toHaveBeenCalledWith(
        233,
        expect.objectContaining({ mapId: mockMap.id }),
        mockUser.uid,
      );
    });

    it("fetches single saved map records correctly if they exist", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        id: mockMap.id,
        data: () => ({ ...mockMap }),
      } as any);

      const result = await savedMapsService.get(mockMap.id);
      expect(result).toEqual(
        expect.objectContaining({ id: mockMap.id, name: mockMap.name }),
      );
    });

    it("returns null gracefully if a map fetch target does not exist", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => false,
      } as any);
      const result = await savedMapsService.get("nonexistent");
      expect(result).toBeNull();
    });

    it("loads collective map lists matching user visibility scope", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: mockMap.id, data: { ...mockMap } }]) as any,
      );
      const result = await savedMapsService.load();
      expect(result).toEqual([
        expect.objectContaining({ id: mockMap.id, name: mockMap.name }),
      ]);
    });
  });

  describe("unauthenticated error handling constraints", () => {
    beforeEach(() => {
      auth.isAuthenticated.mockReturnValue(false);
    });

    it("blocks service requests securely across CRUD layers if credentials fail", async () => {
      await expect(savedMapsService.set(mockMap)).rejects.toThrow();
      await expect(savedMapsService.add(mockMap)).rejects.toThrow();
      await expect(savedMapsService.get(mockMap.id)).rejects.toThrow();
      await expect(savedMapsService.delete(mockMap.id)).rejects.toThrow();
      await expect(savedMapsService.load()).rejects.toThrow();
    });
  });
});
