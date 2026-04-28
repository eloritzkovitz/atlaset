import { render, screen, cleanup } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

const mockOnChange = vi.fn();
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

function TestComponent() {
  const { visitedCountryCodes, upcomingCountryCodes } = useVisitedCountries();
  return (
    <div>
      <div data-testid="visited">{JSON.stringify(visitedCountryCodes)}</div>
      <div data-testid="upcoming">{JSON.stringify(upcomingCountryCodes)}</div>
    </div>
  );
}

describe("useVisitedCountries hook", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    unsubCalled = false;
  });

  afterAll(() => {
    currentMockCodes = ["FR"];
    authReturn.user = mockUser;
  });

  it("reads visited codes from firestore and computes upcoming", () => {
    render(<TestComponent />);
    const visited = screen.getByTestId("visited").textContent || "";
    const upcoming = screen.getByTestId("upcoming").textContent || "";
    expect(JSON.parse(visited)).toEqual(["FR"]);
    expect(JSON.parse(upcoming)).toEqual(["JP"]);
  });

  it("when no user, visited and upcoming are empty", () => {
    authReturn.user = null as any;
    render(<TestComponent />);
    const visited = screen.getByTestId("visited").textContent || "";
    const upcoming = screen.getByTestId("upcoming").textContent || "";
    expect(JSON.parse(visited)).toEqual([]);
    expect(JSON.parse(upcoming)).toEqual([]);
    authReturn.user = mockUser;
  });

  it("falls back to computedVisited when firestore returns empty and exposes helpers", () => {
    currentMockCodes = [];
    render(<TestComponent />);

    const visited = JSON.parse(screen.getByTestId("visited").textContent || "");
    const upcoming = JSON.parse(
      screen.getByTestId("upcoming").textContent || "",
    );
    expect(Array.isArray(visited)).toBe(true);
    expect(upcoming).toEqual(["JP"]);

    currentMockCodes = [];

    function Helpers() {
      const {
        visitedCountryCodes,
        isCountryVisited,
        getCountryVisits,
        getCountryVisitsCategorized,
      } = useVisitedCountries();
      expect(Array.isArray(visitedCountryCodes)).toBe(true);
      if (visitedCountryCodes.length > 0) {
        expect(isCountryVisited(visitedCountryCodes[0])).toBe(true);
      }
      const visits = getCountryVisits("US");
      expect(Array.isArray(visits)).toBe(true);
      const categorized = getCountryVisitsCategorized("JP");
      expect(Array.isArray(categorized.upcoming)).toBe(true);
      return null;
    }
    render(<Helpers />);
  });

  it("unsubscribes on unmount", () => {
    const { unmount } = render(<TestComponent />);
    unmount();
    expect(unsubCalled).toBe(true);
  });
});
