import { describe, it, expect, vi, beforeEach } from "vitest";

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

import { visitedCountriesService } from "./visitedCountriesService";

describe("visitedCountriesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getVisitedCountryCodes returns array when doc exists and has array", async () => {
    mockDoc.mockReturnValue({ ref: "users/u1" });
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ visitedCountryCodes: ["US", "CA"] }),
    });

    const codes = await visitedCountriesService.getVisitedCountryCodes("u1");
    expect(codes).toEqual(["US", "CA"]);
    expect(mockDoc).toHaveBeenCalled();
    expect(mockGetDoc).toHaveBeenCalled();
  });

  it("getVisitedCountryCodes returns [] when doc missing or not array", async () => {
    mockDoc.mockReturnValue({ ref: "users/u2" });
    mockGetDoc.mockResolvedValue({ exists: () => false });
    expect(await visitedCountriesService.getVisitedCountryCodes("u2")).toEqual(
      [],
    );

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ visitedCountryCodes: null }),
    });
    expect(await visitedCountriesService.getVisitedCountryCodes("u2")).toEqual(
      [],
    );
  });

  it("onVisitedCountryCodesChange calls callback with codes and returns unsubscribe", () => {
    mockDoc.mockReturnValue({ ref: "users/u3" });
    mockOnSnapshot.mockImplementation(
      (_userRef: any, cb: (snap: any) => void) => {
        cb({
          exists: () => true,
          data: () => ({ visitedCountryCodes: ["FR"] }),
        });
        return () => {};
      },
    );

    const unsub = visitedCountriesService.onVisitedCountryCodesChange(
      "u3",
      (codes) => {
        expect(codes).toEqual(["FR"]);
      },
    );
    expect(typeof unsub).toBe("function");
    expect(mockOnSnapshot).toHaveBeenCalled();
  });

  it("onVisitedCountryCodesChange calls callback with empty array when snap missing", () => {
    mockDoc.mockReturnValue({ ref: "users/u5" });
    mockOnSnapshot.mockImplementation(
      (_userRef: any, cb: (snap: any) => void) => {
        cb({ exists: () => false });
        return () => {};
      },
    );

    const spy = vi.fn();
    const unsub = visitedCountriesService.onVisitedCountryCodesChange(
      "u5",
      spy,
    );
    expect(spy).toHaveBeenCalledWith([]);
    expect(typeof unsub).toBe("function");
  });

  describe("addVisitedCountryCode", () => {
    it("should update firestore user document by appending the ISO code into the visited array", async () => {
      const mockUserRef = { id: "u6", path: "users/u6" };
      mockDoc.mockReturnValue(mockUserRef);
      mockUpdateDoc.mockResolvedValue(undefined);

      await visitedCountriesService.addVisitedCountryCode("u6", "MX");

      expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "users", "u6");
      expect(mockArrayUnion).toHaveBeenCalledWith("MX");

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockUserRef, {
        visitedCountryCodes: { type: "arrayUnion", val: "MX" },
      });
    });
  });

  describe("removeVisitedCountryCode", () => {
    it("should update firestore user document by slicing out the targeted ISO code from the visited array", async () => {
      const mockUserRef = { id: "u7", path: "users/u7" };
      mockDoc.mockReturnValue(mockUserRef);
      mockUpdateDoc.mockResolvedValue(undefined);

      await visitedCountriesService.removeVisitedCountryCode("u7", "MX");

      expect(mockDoc).toHaveBeenCalledWith(expect.any(Object), "users", "u7");
      expect(mockArrayRemove).toHaveBeenCalledWith("MX");

      expect(mockUpdateDoc).toHaveBeenCalledWith(mockUserRef, {
        visitedCountryCodes: { type: "arrayRemove", val: "MX" },
      });
    });
  });
});
