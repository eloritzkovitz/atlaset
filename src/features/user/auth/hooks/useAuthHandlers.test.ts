import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthHandlers } from "./useAuthHandlers";
import { authService } from "../services/authService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../services/authService", () => ({
  authService: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    resetPassword: vi.fn(),
    signInWithGoogle: vi.fn(),
    logout: vi.fn(),
  },
}));

describe("useAuthHandlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("handles successful sign in with reactivation and navigation", async () => {
    vi.mocked(authService.signIn).mockResolvedValueOnce({
      user: { uid: "123" } as any,
      reactivated: true,
    });

    const { result } = renderHook(() => useAuthHandlers());

    await act(async () => {
      await result.current.handleSignIn("test@test.com", "pass", true);
    });

    expect(authService.signIn).toHaveBeenCalledWith(
      "test@test.com",
      "pass",
      true,
    );
    expect(sessionStorage.getItem("reactivated")).toBe("1");
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(result.current.error).toBe("");
  });

  it("captures errors when an action throws", async () => {
    vi.mocked(authService.signIn).mockRejectedValueOnce(
      new Error("Auth failed"),
    );
    vi.mocked(authService.signUp).mockRejectedValueOnce("String error");

    const { result } = renderHook(() => useAuthHandlers());

    await act(async () => {
      await result.current.handleSignIn("test@test.com", "wrong");
    });
    expect(result.current.error).toBe("Auth failed");
    expect(mockNavigate).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.handleSignUp("test@test.com", "wrong");
    });
    expect(result.current.error).toBe("String error");
  });

  it("executes signUp, forgotPassword, googleSignIn, and logout flows", async () => {
    vi.mocked(authService.signUp).mockResolvedValueOnce({} as any);
    vi.mocked(authService.resetPassword).mockResolvedValueOnce();
    vi.mocked(authService.signInWithGoogle).mockResolvedValueOnce({
      user: { uid: "123" } as any,
      reactivated: false,
    });
    vi.mocked(authService.logout).mockResolvedValueOnce();

    const { result } = renderHook(() => useAuthHandlers());

    await act(async () => {
      await result.current.handleSignUp("test@test.com", "pass");
    });
    expect(authService.signUp).toHaveBeenCalledWith("test@test.com", "pass");
    expect(mockNavigate).toHaveBeenLastCalledWith("/");

    await act(async () => {
      await result.current.handleForgotPassword("test@test.com");
    });
    expect(authService.resetPassword).toHaveBeenCalledWith("test@test.com");

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });
    expect(authService.signInWithGoogle).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenLastCalledWith("/");

    await act(async () => {
      await result.current.handleLogout();
    });
    expect(authService.logout).toHaveBeenCalled();
  });
});
