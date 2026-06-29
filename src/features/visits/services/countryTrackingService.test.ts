import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockUser } from "@test-utils/authMocks";
import { mockFirestoreControls as fs } from "@test-utils/firebaseMockRegistry";
import { countryTrackingService } from "./countryTrackingService";

vi.mock("@app/firebase", () => ({ db: {} }));

describe("countryTrackingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fs.arrayUnion.mockImplementation((val) => ({ type: "arrayUnion", val }));
    fs.arrayRemove.mockImplementation((val) => ({ type: "arrayRemove", val }));
  });

  describe("getCountryCodes", () => {
    it("returns array when doc exists and has requested field", async () => {
      fs.doc.mockReturnValue({ ref: "users/u1" } as any);
      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ visitedCountryCodes: ["US", "CA"] }),
      } as any);

      const codes = await countryTrackingService.getCountryCodes(
        "u1",
        "visitedCountryCodes",
      );
      expect(codes).toEqual(["US", "CA"]);
      expect(fs.doc).toHaveBeenCalledWith(expect.any(Object), "users", "u1");
      expect(fs.getDoc).toHaveBeenCalled();
    });

    it("returns [] when doc is missing or field is not an array", async () => {
      fs.doc.mockReturnValue({ ref: "users/u2" } as any);
      fs.getDoc.mockResolvedValue({ exists: () => false } as any);

      expect(
        await countryTrackingService.getCountryCodes(
          "u2",
          "visitedCountryCodes",
        ),
      ).toEqual([]);

      fs.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ visitedCountryCodes: null }),
      } as any);

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
      fs.doc.mockReturnValue({ ref: "users/u3" } as any);
      fs.onSnapshot.mockImplementation(
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
      expect(fs.onSnapshot).toHaveBeenCalled();
    });

    it("calls callback with empty arrays when document context is missing", () => {
      fs.doc.mockReturnValue({ ref: "users/u5" } as any);
      fs.onSnapshot.mockImplementation(
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
  });

  describe("addCountryCode (Mutual Exclusivity Rules)", () => {
    it("should update Firestore document by unioning target array and atomically removing from opposing bucket field", async () => {
      const freshUser = createMockUser();
      fs.doc.mockReturnValue(freshUser as any);
      fs.updateDoc.mockResolvedValue(undefined as any);

      await countryTrackingService.addCountryCode(
        "u6",
        "MX",
        "visitedCountryCodes",
      );

      expect(fs.doc).toHaveBeenCalledWith(expect.any(Object), "users", "u6");
      expect(fs.arrayUnion).toHaveBeenCalledWith("MX");
      expect(fs.arrayRemove).toHaveBeenCalledWith("MX");

      expect(fs.updateDoc).toHaveBeenCalledWith(freshUser, {
        visitedCountryCodes: { type: "arrayUnion", val: "MX" },
        wantToVisitCountryCodes: { type: "arrayRemove", val: "MX" },
      });
    });

    it("should reverse tracking keys correctly when target configuration is the bucket array", async () => {
      const freshUser = createMockUser();
      fs.doc.mockReturnValue(freshUser as any);
      fs.updateDoc.mockResolvedValue(undefined as any);

      await countryTrackingService.addCountryCode(
        "u6_bucket",
        "ZAF",
        "wantToVisitCountryCodes",
      );

      expect(fs.updateDoc).toHaveBeenCalledWith(freshUser, {
        wantToVisitCountryCodes: { type: "arrayUnion", val: "ZAF" },
        visitedCountryCodes: { type: "arrayRemove", val: "ZAF" },
      });
    });
  });

  describe("removeCountryCode", () => {
    it("should isolate targeted collection field and strip the tracked ISO code parameter reference", async () => {
      const freshUser = createMockUser();
      fs.doc.mockReturnValue(freshUser as any);
      fs.updateDoc.mockResolvedValue(undefined as any);

      await countryTrackingService.removeCountryCode(
        "u7",
        "MX",
        "visitedCountryCodes",
      );

      expect(fs.doc).toHaveBeenCalledWith(expect.any(Object), "users", "u7");
      expect(fs.arrayRemove).toHaveBeenCalledWith("MX");

      expect(fs.updateDoc).toHaveBeenCalledWith(freshUser, {
        visitedCountryCodes: { type: "arrayRemove", val: "MX" },
      });
    });
  });
});
