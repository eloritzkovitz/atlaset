import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useUsernameValidation } from "./useUsernameValidation";
import { profileService } from "../services/profileService";
import { isUsernameFormatValid } from "../utils/username";

vi.mock("../services/profileService", () => ({
  profileService: { checkUsernameExists: vi.fn() },
}));

vi.mock("../utils/username", () => ({
  isUsernameFormatValid: vi.fn(),
}));

describe("useUsernameValidation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns idle status when username is empty or matches currentUsername", () => {
    const { result, rerender } = renderHook(
      ({ username, current }) => useUsernameValidation(username, current),
      { initialProps: { username: "", current: "john_doe" } },
    );

    expect(result.current.status).toBe("idle");

    rerender({ username: "john_doe", current: "john_doe" });
    expect(result.current.status).toBe("idle");
    expect(profileService.checkUsernameExists).not.toHaveBeenCalled();
  });

  it("returns invalid immediately if format check fails", () => {
    vi.mocked(isUsernameFormatValid).mockReturnValue(false);

    const { result } = renderHook(() => useUsernameValidation("invalid!!"));

    expect(result.current.status).toBe("invalid");
    expect(result.current.translationKey).toBe("username.status.invalid");
    expect(profileService.checkUsernameExists).not.toHaveBeenCalled();
  });

  it("debounces and resolves username availability (available & taken)", async () => {
    vi.mocked(isUsernameFormatValid).mockReturnValue(true);
    vi.mocked(profileService.checkUsernameExists)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const { result, rerender } = renderHook(
      ({ name }) => useUsernameValidation(name),
      { initialProps: { name: "user1" } },
    );

    expect(result.current.status).toBe("checking");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.status).toBe("available");

    rerender({ name: "user2" });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.status).toBe("taken");
    expect(result.current.translationKey).toBe("username.status.taken");
  });

  it("cancels pending API calls if username changes before timeout", async () => {
    vi.mocked(isUsernameFormatValid).mockReturnValue(true);
    vi.mocked(profileService.checkUsernameExists).mockResolvedValue(false);

    const { rerender } = renderHook(({ name }) => useUsernameValidation(name), {
      initialProps: { name: "user1" },
    });

    vi.advanceTimersByTime(200);
    rerender({ name: "user2" });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(profileService.checkUsernameExists).not.toHaveBeenCalledWith(
      "user1",
    );
    expect(profileService.checkUsernameExists).toHaveBeenCalledWith("user2");
  });

  it("handles API errors gracefully and skips state updates when unmounted mid-request", async () => {
    vi.mocked(isUsernameFormatValid).mockReturnValue(true);

    vi.mocked(profileService.checkUsernameExists).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    const { result, rerender } = renderHook(
      ({ name }) => useUsernameValidation(name),
      {
        initialProps: { name: "user1" },
      },
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.status).toBe("idle");

    let rejectApi!: (reason?: unknown) => void;
    vi.mocked(profileService.checkUsernameExists).mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectApi = reject;
      }),
    );

    rerender({ name: "user2" });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    rerender({ name: "user3" });

    await act(async () => {
      rejectApi(new Error("Network Error"));
    });
  });
});
