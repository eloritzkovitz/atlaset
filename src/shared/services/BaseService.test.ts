import { describe, it, expect, beforeEach, vi } from "vitest";
import { BaseService, type BaseEntity, type LocalTable } from "./BaseService";
import {
  mockAuthControls as auth,
  mockFirestoreControls as fs,
} from "@test-utils/firebaseMockRegistry";

class MockService extends BaseService<BaseEntity, LocalTable<BaseEntity>> {
  protected readonly collectionName = "test-col";
  protected readonly localTable = {
    toArray: vi.fn(),
    add: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  } as unknown as LocalTable<BaseEntity>;
}

class CloudOnlyService extends BaseService<BaseEntity, any> {
  protected readonly collectionName = "cloud-only";
  protected readonly localTable = undefined;
}

describe("BaseService", () => {
  let service: MockService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MockService();
  });

  describe("load", () => {
    it("uses Firestore when authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(true);

      fs.getDocs.mockResolvedValue({
        docs: [{ id: "1", data: () => ({ name: "Test" }) }],
      });

      await service.load();
      expect(fs.getDocs).toHaveBeenCalled();
    });

    it("uses localTable when not authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await service.load();
      expect(service["localTable"]!.toArray).toHaveBeenCalled();
    });

    it("returns an empty array when not authenticated and no localTable exists", async () => {
      const cloudService = new CloudOnlyService();
      auth.isAuthenticated.mockReturnValue(false);
      const result = await cloudService.load();
      expect(result).toEqual([]);
    });
  });

  describe("add", () => {
    it("saves to Firestore when authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      await service.add({ id: "1" });
      expect(fs.setDoc).toHaveBeenCalled();
    });

    it("saves to localTable when not authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await service.add({ id: "1" });
      expect(service["localTable"]!.add).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("updates Firestore when authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      await service.update("1", { name: "Updated" });
      expect(fs.updateDoc).toHaveBeenCalled();
    });

    it("updates localTable when not authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await service.update("1", { name: "Updated" });
      expect(service["localTable"]!.update).toHaveBeenCalled();
    });

    it("throws an error when not authenticated and no localTable exists", async () => {
      const cloudService = new CloudOnlyService();
      auth.isAuthenticated.mockReturnValue(false);
      await expect(
        cloudService.update("1", { name: "Updated" }),
      ).rejects.toThrow("Authentication required for cloud-only entities.");
    });
  });

  describe("delete", () => {
    it("deletes from Firestore when authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(true);
      await service.delete("1");
      expect(fs.deleteDoc).toHaveBeenCalled();
    });

    it("deletes from localTable when not authenticated", async () => {
      auth.isAuthenticated.mockReturnValue(false);
      await service.delete("1");
      expect(service["localTable"]!.delete).toHaveBeenCalled();
    });
  });
});
