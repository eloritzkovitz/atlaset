import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signUp,
  signIn,
  signInWithGoogle,
  logout,
} from "@services/authService";

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
    await signIn(email, password);
    navigate("/");
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
    handleGoogleSignIn,
    handleLogout,
  };
}
