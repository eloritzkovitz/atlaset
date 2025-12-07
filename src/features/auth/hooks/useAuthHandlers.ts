import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, signInWithGoogle } from "@services/authService";

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

  return { error, setError, handleSignUp, handleSignIn, handleGoogleSignIn };
}
