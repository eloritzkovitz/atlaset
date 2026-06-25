import { describe, it, expect, vi, beforeEach } from "vitest";
import { countryTrackingService } from "./countryTrackingService";

const {
  mockDoc,
  mockGetDoc,
  mockUpdateDoc,
  mockOnSnapshot,
  mockArrayUnion,
  mockArrayRemove,
} = vi.hoisted(() => ({
  mockDoc: vi.fn(),
  mockGetDoc: vi.fn(),
  mockUpdateDoc: vi.fn(),
  mockOnSnapshot: vi.fn(),
  mockArrayUnion: vi.fn((val) => ({ type: "arrayUnion", val })),
  mockArrayRemove: vi.fn((val) => ({ type: "arrayRemove", val })),
}));

vi.mock("firebase/firestore", async () => {
  return {
    doc: mockDoc,
    getDoc: mockGetDoc,
    updateDoc: mockUpdateDoc,
    onSnapshot: mockOnSnapshot,
    arrayUnion: mockArrayUnion,
    arrayRemove: mockArrayRemove,
  };
});

vi.mock("@app/firebase", () => ({ db: {} }));

describe("countryTrackingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCountryCodes", () => {
    it("returns array when doc exists and has requested field", async () => {
      mockDoc.mockReturnValue({ ref: "users/u1" });
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ visitedCountryCodes: ["US", "CA"] }),
      });

      const codes = await countryTrackingService.getCountryCodes(
        "u1",
        "visitedCountryCodes",
      );
      expect(codes).toEqual(["US", "CA"]);
      expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "users", "u1");
      expect(mockGetDoc).toHaveBeenCalled();
    });

    it("returns [] when doc is missing or field is not an array", async () => {
      mockDoc.mockReturnValue({ ref: "users/u2" });
      mockGetDoc.mockResolvedValue({ exists: () => false });

      expect(
        await countryTrackingService.getCountryCodes(
          "u2",
          "visitedCountryCodes",
        ),
      ).toEqual([]);

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ visitedCountryCodes: null }),
      });

      expect(
        await countryTrackingService.getCountryCodes(
          "u2",
          "visitedCountryCodes",
        ),
      ).toEqual([]);
    });
  });

  describe("onTrackingDataChange", () => {
    it("calls callback with fully mapped TrackingData object structures", () => {
      mockDoc.mockReturnValue({ ref: "users/u3" });
      mockOnSnapshot.mockImplementation(
        (_userRef: any, cb: (snap: any) => void) => {
          cb({
            exists: () => true,
            data: () => ({
              visitedCountryCodes: ["FR"],
              wantToVisitCountryCodes: ["JP", "IT"],
            }),
          });
          return () => {};
        },
      );

      const spy = vi.fn();
      const unsub = countryTrackingService.onTrackingDataChange("u3", spy);

      expect(spy).toHaveBeenCalledWith({
        visitedCountryCodes: ["FR"],
        wantToVisitCountryCodes: ["JP", "IT"],
      });
      expect(typeof unsub).toBe("function");
      expect(mockOnSnapshot).toHaveBeenCalled();
    });

    it("calls callback with empty arrays when document context is missing", () => {
      mockDoc.mockReturnValue({ ref: "users/u5" });
      mockOnSnapshot.mockImplementation(
        (_userRef: any, cb: (snap: any) => void) => {
          cb({ exists: () => false });
          return () => {};
        },
      );

      const spy = vi.fn();
      countryTrackingService.onTrackingDataChange("u5", spy);

      expect(spy).toHaveBeenCalledWith({
        visitedCountryCodes: [],
        wantToVisitCountryCodes: [],
      });
    });

    it("handles partial field existence and corrupt values with safe default states", () => {
      mockDoc.mockReturnValue({ ref: "users/u_partial" });
      mockOnSnapshot.mockImplementation(
        (_userRef: any, cb: (snap: any) => void) => {
          cb({
            exists: () => true,
            data: () => ({
              visitedCountryCodes: null,
              wantToVisitCountryCodes: ["BR"],
            }),
          });
          return () => {};
        },
      );

      const spy = vi.fn();
      countryTrackingService.onTrackingDataChange("u_partial", spy);

      expect(spy).toHaveBeenCalledWith({
        visitedCountryCodes: [],
        wantToVisitCountryCodes: ["BR"],
      });
    });
  });

  describe("addCountryCode (Mutual Exclusivity Rules)", () => {
    it("should update Firestore document by unioning target array and atomically removing from opposing bucket field", async () => {
      const mockUserRef = { id: "u6", path: "users/u6" };
      mockDoc.mockReturnValue(mockUserRef);
      mockUpdateDoc.mockResolvedValue(undefined);

      await countryTrackingService.addCountryCode(
        "u6",
        "MX",
        "visitedCountryCodes",
      );

      expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "users", "u6");
      expect(mockArrayUnion).toHaveBeenCalledWith("MX");
      expect(mockArrayRemove).toHaveBeenCalledWith("MX");

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockUserRef, {
        visitedCountryCodes: { type: "arrayUnion", val: "MX" },
        wantToVisitCountryCodes: { type: "arrayRemove", val: "MX" },
      });
    });

    it("should reverse tracking keys correctly when target configuration is the bucket array", async () => {
      const mockUserRef = { id: "u6_bucket", path: "users/u6_bucket" };
      mockDoc.mockReturnValue(mockUserRef);
      mockUpdateDoc.mockResolvedValue(undefined);

      await countryTrackingService.addCountryCode(
        "u6_bucket",
        "ZAF",
        "wantToVisitCountryCodes",
      );

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockUserRef, {
        wantToVisitCountryCodes: { type: "arrayUnion", val: "ZAF" },
        visitedCountryCodes: { type: "arrayRemove", val: "ZAF" },
      });
    });
  });

  describe("removeCountryCode", () => {
    it("should isolate targeted collection field and strip the tracked ISO code parameter reference", async () => {
      const mockUserRef = { id: "u7", path: "users/u7" };
      mockDoc.mockReturnValue(mockUserRef);
      mockUpdateDoc.mockResolvedValue(undefined);

      await countryTrackingService.removeCountryCode(
        "u7",
        "MX",
        "visitedCountryCodes",
      );

      expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "users", "u7");
      expect(mockArrayRemove).toHaveBeenCalledWith("MX");

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockUserRef, {
        visitedCountryCodes: { type: "arrayRemove", val: "MX" },
      });
    });
  });
});
