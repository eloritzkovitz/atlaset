import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { countryTrackingService } from "./countryTrackingService";

describe("countryTrackingService", () => {
  const MOCK_USER_REF = { path: "users/u1" };

  beforeEach(() => {
    vi.clearAllMocks();

    fs.doc.mockReturnValue(MOCK_USER_REF as any);

    fs.arrayUnion.mockImplementation((val) => ({ type: "arrayUnion", val }));
    fs.arrayRemove.mockImplementation((val) => ({ type: "arrayRemove", val }));
  });

  describe("getCountryCodes", () => {
    it("returns array when doc exists and has requested field", async () => {
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ manualVisitedCountryCodes: ["US", "CA"] }),
      } as any);

      const codes = await countryTrackingService.getCountryCodes(
        "u1",
        "manualVisitedCountryCodes",
      );

      expect(codes).toEqual(["US", "CA"]);
      expect(fs.getDoc).toHaveBeenCalledWith(MOCK_USER_REF);
    });

    it("returns [] when doc is missing or field is not an array", async () => {
      fs.getDoc.mockResolvedValue({ exists: () => false } as any);

      expect(
        await countryTrackingService.getCountryCodes(
          "u2",
          "manualVisitedCountryCodes",
        ),
      ).toEqual([]);

      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ manualVisitedCountryCodes: null }),
      } as any);

      expect(
        await countryTrackingService.getCountryCodes(
          "u2",
          "manualVisitedCountryCodes",
        ),
      ).toEqual([]);
    });
  });

  describe("onTrackingDataChange", () => {
    it("calls callback with fully mapped TrackingData object structures", () => {
      fs.onSnapshot.mockImplementation(
        (_userRef: any, cb: (snap: any) => void) => {
          cb({
            exists: () => true,
            data: () => ({
              manualVisitedCountryCodes: ["FR"],
              wantToVisitCountryCodes: ["JP", "IT"],
            }),
          });
          return () => {};
        },
      );

      const spy = vi.fn();
      const unsub = countryTrackingService.onTrackingDataChange("u3", spy);

      expect(spy).toHaveBeenCalledWith({
        manualVisitedCountryCodes: ["FR"],
        wantToVisitCountryCodes: ["JP", "IT"],
      });
      expect(typeof unsub).toBe("function");
    });

    it("calls callback with empty arrays when document context is missing", () => {
      fs.onSnapshot.mockImplementation(
        (_userRef: any, cb: (snap: any) => void) => {
          cb({
            exists: () => false,
            data: () => undefined,
          });
          return () => {};
        },
      );

      const spy = vi.fn();
      countryTrackingService.onTrackingDataChange("u5", spy);

      expect(spy).toHaveBeenCalledWith({
        manualVisitedCountryCodes: [],
        wantToVisitCountryCodes: [],
      });
    });
  });

  describe("addCountryCode (Mutual Exclusivity Rules)", () => {
    it("should update Firestore document by unioning target array and atomically removing from opposing bucket field", async () => {
      fs.updateDoc.mockResolvedValue(undefined as any);

      await countryTrackingService.addCountryCode(
        "u6",
        "MX",
        "manualVisitedCountryCodes",
      );

      expect(fs.updateDoc).toHaveBeenCalledWith(MOCK_USER_REF, {
        manualVisitedCountryCodes: { type: "arrayUnion", val: "MX" },
        wantToVisitCountryCodes: { type: "arrayRemove", val: "MX" },
      });
    });

    it("should reverse tracking keys correctly when target configuration is the bucket array", async () => {
      await countryTrackingService.addCountryCode(
        "u6_bucket",
        "ZAF",
        "wantToVisitCountryCodes",
      );

      expect(fs.updateDoc).toHaveBeenCalledWith(MOCK_USER_REF, {
        wantToVisitCountryCodes: { type: "arrayUnion", val: "ZAF" },
        manualVisitedCountryCodes: { type: "arrayRemove", val: "ZAF" },
      });
    });
  });

  describe("removeCountryCode", () => {
    it("should isolate targeted collection field and strip the tracked ISO code parameter reference", async () => {
      fs.updateDoc.mockResolvedValue(undefined as any);

      await countryTrackingService.removeCountryCode(
        "u7",
        "MX",
        "manualVisitedCountryCodes",
      );

      expect(fs.updateDoc).toHaveBeenCalledWith(MOCK_USER_REF, {
        manualVisitedCountryCodes: { type: "arrayRemove", val: "MX" },
      });
    });
  });
});
