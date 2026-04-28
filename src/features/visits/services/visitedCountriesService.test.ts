import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockOnSnapshot = vi.fn();

vi.mock("firebase/firestore", async () => {
  return {
    doc: (...args: any[]) => mockDoc(...args),
    getDoc: (...args: any[]) => mockGetDoc(...args),
    updateDoc: (...args: any[]) => mockUpdateDoc(...args),
    onSnapshot: (...args: any[]) => mockOnSnapshot(...args),
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

  it("setVisitedCountryCodes calls updateDoc with doc ref and payload", async () => {
    const fakeRef = { ref: "users/u4" };
    mockDoc.mockReturnValue(fakeRef);
    mockUpdateDoc.mockResolvedValue(undefined);

    await visitedCountriesService.setVisitedCountryCodes("u4", ["DE"]);
    expect(mockDoc).toHaveBeenCalledWith({}, "users", "u4");
    expect(mockUpdateDoc).toHaveBeenCalledWith(fakeRef, {
      visitedCountryCodes: ["DE"],
    });
  });
});
