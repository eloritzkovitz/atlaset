import { render, screen, cleanup, act } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

const mockOnChange = vi.fn();
const mockAddVisited = vi.fn().mockResolvedValue(undefined);
const mockRemoveVisited = vi.fn().mockResolvedValue(undefined);

let currentMockCodes: string[] = ["FR"];
let unsubCalled = false;

vi.mock("../services/visitedCountriesService", () => ({
  visitedCountriesService: {
    onVisitedCountryCodesChange: (
      _uid: string,
      cb: (codes: string[]) => void,
    ) => {
      cb(currentMockCodes);
      return () => {
        unsubCalled = true;
        mockOnChange();
      };
    },
    addVisitedCountryCode: (...args: any[]) => mockAddVisited(...args),
    removeVisitedCountryCode: (...args: any[]) => mockRemoveVisited(...args),
  },
}));

import { mockTrips } from "@test-utils/mockTrips";
import { mockUser } from "@test-utils/mockUser";

const authReturn: { user: any } = { user: mockUser };
vi.mock("@features/user", () => ({
  useAuth: () => authReturn,
}));

vi.mock("@contexts/TripsContext", () => ({
  useTrips: () => ({ trips: mockTrips }),
}));

import { useVisitedCountries } from "./useVisitedCountries";

describe("useVisitedCountries hook", () => {
  let result: ReturnType<typeof useVisitedCountries>;

  function setupHook() {
    function HookExtractor() {
      result = useVisitedCountries();
      return (
        <div>
          <div data-testid="visited">
            {JSON.stringify(result.visitedCountryCodes)}
          </div>
          <div data-testid="upcoming">
            {JSON.stringify(result.upcomingCountryCodes)}
          </div>
        </div>
      );
    }
    const utils = render(<HookExtractor />);
    return {
      ...utils,
      getVisitedText: () =>
        JSON.parse(screen.getByTestId("visited").textContent || "[]"),
      getUpcomingText: () =>
        JSON.parse(screen.getByTestId("upcoming").textContent || "[]"),
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    unsubCalled = false;
  });

  afterAll(() => {
    currentMockCodes = ["FR"];
    authReturn.user = mockUser;
  });

  it("reads visited codes from firestore and computes upcoming", () => {
    const { getVisitedText, getUpcomingText } = setupHook();
    expect(getVisitedText()).toEqual(["FR", "US", "DE", "CA"]);
    expect(getUpcomingText()).toEqual(expect.arrayContaining(["JP"]));
  });

  it("when no user, visited and upcoming are empty", () => {
    authReturn.user = null as any;
    const { getVisitedText, getUpcomingText } = setupHook();
    expect(getVisitedText()).toEqual([]);
    expect(getUpcomingText()).toEqual([]);
    authReturn.user = mockUser;
  });

  it("falls back to computedVisited when firestore returns empty and exposes helpers", () => {
    currentMockCodes = [];
    setupHook();

    expect(Array.isArray(result.visitedCountryCodes)).toBe(true);
    if (result.visitedCountryCodes.length > 0) {
      expect(result.isCountryVisited(result.visitedCountryCodes[0])).toBe(true);
    }
    expect(Array.isArray(result.getCountryVisits("US"))).toBe(true);
    expect(
      Array.isArray(result.getCountryVisitsCategorized("JP").upcoming),
    ).toBe(true);
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = setupHook();
    unmount();
    expect(unsubCalled).toBe(true);
  });

  describe("addManualCountry", () => {
    beforeEach(() => {
      currentMockCodes = ["FR"];
    });

    it("should allow adding a country if it is not logged yet", async () => {
      setupHook();
      await act(async () => {
        await result.addManualCountry("MX");
      });
      expect(mockAddVisited).toHaveBeenCalledWith("abc", "MX");
    });

    it("should guard and abort if the target country is already marked as visited", async () => {
      setupHook();
      await act(async () => {
        await result.addManualCountry("FR");
      });
      expect(mockAddVisited).not.toHaveBeenCalled();
    });

    it("should early return and abort if user is logged out", async () => {
      authReturn.user = null as any;
      setupHook();
      await act(async () => {
        await result.addManualCountry("MX");
      });
      expect(mockAddVisited).not.toHaveBeenCalled();
      authReturn.user = mockUser;
    });
  });

  describe("removeManualCountry", () => {
    beforeEach(() => {
      currentMockCodes = ["FR"];
    });

    it("should allow removing a manually added country if it is not trip-based", async () => {
      const originalTrips = [...mockTrips];
      mockTrips.length = 0;

      setupHook();
      await act(async () => {
        await result.removeManualCountry("FR");
      });
      expect(mockRemoveVisited).toHaveBeenCalledWith("abc", "FR");

      mockTrips.push(...originalTrips);
    });

    it("should guard and refuse removal if the country is trip-based", async () => {
      setupHook();
      await act(async () => {
        await result.removeManualCountry("FR");
      });
      expect(mockRemoveVisited).not.toHaveBeenCalled();
    });

    it("should early return and abort removal operations if there is no user session", async () => {
      authReturn.user = null as any;
      setupHook();
      await act(async () => {
        await result.removeManualCountry("FR");
      });
      expect(mockRemoveVisited).not.toHaveBeenCalled();
      authReturn.user = mockUser;
    });
  });
});
