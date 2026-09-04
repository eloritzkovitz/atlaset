import { describe, it, beforeEach, expect } from "vitest";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";
import { createMockUser } from "@test-utils/authMocks";
import { createMockSnapshot } from "@test-utils/firestoreMocks";
import { savedMapsService } from "./savedMapsService";
import type { SavedMap } from "../types";

describe("savedMapsService", () => {
  const mockMap: SavedMap = {
    id: "map1",
    name: "Test Map",
    layers: [],
    markers: [],
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    auth.getCurrentUser.mockReturnValue(createMockUser());

    fs.collection.mockReturnValue({ path: "mock-col" } as any);
    fs.doc.mockReturnValue({ path: "mock-doc" } as any);
  });

  describe("authenticated paths", () => {
    beforeEach(() => auth.isAuthenticated.mockReturnValue(true));

    it("manages map CRUD operations", async () => {
      const { id, ...data } = mockMap;
      await savedMapsService.add(mockMap);
      expect(fs.setDoc).toHaveBeenCalledWith(expect.anything(), data);

      await savedMapsService.set(mockMap);
      expect(fs.setDoc).toHaveBeenCalledWith(expect.anything(), data, {
        merge: true,
      });

      await savedMapsService.delete(mockMap);
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("fetches single saved map records correctly", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        id: mockMap.id,
        data: () => ({ ...mockMap }),
      } as any);

      const result = await savedMapsService.get(mockMap.id);
      expect(result).toEqual(expect.objectContaining({ id: mockMap.id }));
    });

    it("returns null if a map does not exist", async () => {
      fs.getDoc.mockResolvedValue({ exists: () => false } as any);
      const result = await savedMapsService.get("nonexistent");
      expect(result).toBeNull();
    });

    it("loads all saved maps", async () => {
      fs.getDocs.mockResolvedValue(
        createMockSnapshot([{ id: mockMap.id, data: { ...mockMap } }]) as any,
      );
      const result = await savedMapsService.load();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockMap.id);
    });
  });

  describe("unauthenticated error handling", () => {
    it("blocks service requests if credentials fail", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await expect(savedMapsService.set(mockMap)).rejects.toThrow();
      await expect(savedMapsService.add(mockMap)).rejects.toThrow();
      await expect(savedMapsService.get(mockMap.id)).rejects.toThrow();
      await expect(savedMapsService.delete(mockMap)).rejects.toThrow();
      await expect(savedMapsService.load()).rejects.toThrow();
    });
  });
});
