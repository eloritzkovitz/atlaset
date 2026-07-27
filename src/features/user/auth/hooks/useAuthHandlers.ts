import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

/**
 * Provides authentication handlers.
 */
export function useAuthHandlers() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /** Handles post-authentication success actions, such as navigation and session storage updates. */
  const handlePostAuthSuccess = (result?: { reactivated?: boolean }) => {
    if (result?.reactivated) {
      sessionStorage.setItem("reactivated", "1");
    }
    navigate("/");
  };

  /** Executes an authentication action with loading and error handling. */
  const executeAuthAction = async <T>(
    action: () => Promise<T>,
  ): Promise<T | undefined> => {
    setError("");
    setIsLoading(true);
    try {
      return await action();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  /** Handles sign-up requests. */
  const handleSignUp = async (email: string, password: string) => {
    const res = await executeAuthAction(() =>
      authService.signUp(email, password),
    );
    if (res) navigate("/");
  };

  /** Handles email/password sign-in requests. */
  const handleSignIn = async (
    email: string,
    password: string,
    keepLoggedIn = false,
  ) => {
    const result = await executeAuthAction(() =>
      authService.signIn(email, password, keepLoggedIn),
    );
    if (result) handlePostAuthSuccess(result);
  };

  /** Handles forgot password requests. */
  const handleForgotPassword = async (email: string) => {
    await executeAuthAction(() => authService.resetPassword(email));
  };

  /** Handles Google sign-in requests. */
  const handleGoogleSignIn = async () => {
    const result = await executeAuthAction(() =>
      authService.signInWithGoogle(),
    );
    if (result) handlePostAuthSuccess(result);
  };

  /** Handles logout requests. */
  const handleLogout = async () => {
    const res = await executeAuthAction(() => authService.logout());
    if (res !== undefined) navigate("/");
  };

  return {
    error,
    setError,
    isLoading,
    handleSignUp,
    handleSignIn,
    handleForgotPassword,
    handleGoogleSignIn,
    handleLogout,
  };
}
