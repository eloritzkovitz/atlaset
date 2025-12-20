import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  signIn,
  resetPassword,
  signInWithGoogle,
  logout,
  signInWithPersistence,
} from "../services/authService";

/**
 * Provides authentication handlers for sign-up, sign-in, Google sign-in, and logout.
 * @returns An object containing error state and handler functions for authentication.
 */
export function useAuthHandlers() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/Password Sign-Up handler
  const handleSignUp = async (email: string, password: string) => {
    setError("");
    await signUp(email, password);
    navigate("/");
  };

  // Email/Password Sign-In handler
  const handleSignIn = async (email: string, password: string) => {
    setError("");
    const result = await signIn(email, password);
    if (result?.reactivated) {
      sessionStorage.setItem("reactivated", "1");
    }
    navigate("/");
  };

  // Email/Password Sign-In handler with persistence option
  const handleSignInWithPersistence = async (
    email: string,
    password: string,
    keepLoggedIn: boolean
  ) => {
    setError("");
    const result = await signInWithPersistence(email, password, keepLoggedIn);
    if (result?.reactivated) {
      sessionStorage.setItem("reactivated", "1");
    }
    navigate("/");
  };

  // Forgot Password handler
  const handleForgotPassword = async (email: string) => {
    setError("");
    await resetPassword(email);
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setError("");
    await signInWithGoogle();
    navigate("/");
  };

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return {
    error,
    setError,
    handleSignUp,
    handleSignIn,
    handleSignInWithPersistence,
    handleForgotPassword,
    handleGoogleSignIn,
    handleLogout,
  };
}
