import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { profileService } from "../services/profileService";
import { useHomeCountry } from "./useHomeCountry";
import { useAuth } from "../../auth/hooks/useAuth";

vi.mock("../services/profileService", () => ({
  profileService: {
    getHomeCountry: vi.fn(),
    setHomeCountry: vi.fn(),
  },
}));

vi.mock("../../auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetHomeCountry = vi.mocked(profileService.getHomeCountry);
const mockedSetHomeCountry = vi.mocked(profileService.setHomeCountry);

describe("useHomeCountry", () => {
  it("loads the user's home country", async () => {
    mockedUseAuth.mockReturnValue({
      user: { uid: "user-1" },
    } as ReturnType<typeof useAuth>);

    mockedGetHomeCountry.mockResolvedValue("IL");

    const { result } = renderHook(() => useHomeCountry());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.homeCountry).toBe("IL");
    expect(mockedGetHomeCountry).toHaveBeenCalledWith("user-1");
  });

  it("resets home country when there is no user", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
    } as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useHomeCountry());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.homeCountry).toBe("");
    expect(mockedGetHomeCountry).not.toHaveBeenCalled();
  });

  it("sets the home country and updates local state", async () => {
    mockedUseAuth.mockReturnValue({
      user: { uid: "user-1" },
    } as ReturnType<typeof useAuth>);

    mockedGetHomeCountry.mockResolvedValue("");
    mockedSetHomeCountry.mockResolvedValue(undefined);

    const { result } = renderHook(() => useHomeCountry());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.setHomeCountry("IL");
    });

    expect(mockedSetHomeCountry).toHaveBeenCalledWith("user-1", "IL");
    expect(result.current.homeCountry).toBe("IL");
  });

  it("does nothing when setting the home country without a user", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
    } as ReturnType<typeof useAuth>);

    const { result } = renderHook(() => useHomeCountry());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.setHomeCountry("IL");
    });

    expect(mockedSetHomeCountry).not.toHaveBeenCalled();
    expect(result.current.homeCountry).toBe("");
  });
});
