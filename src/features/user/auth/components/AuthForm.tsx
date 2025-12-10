import { useState } from "react";
import { Checkbox } from "@components";
import { GoogleSignInButton } from "./GoogleSignInButton";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (
    email: string,
    password: string,
    keepLoggedIn: boolean
  ) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  onForgotPassword?: (email: string) => void;
  buttonText?: string;
  showGoogleSignInButton?: boolean;
  error?: string;
  children?: React.ReactNode;
}

export function AuthForm({
  mode,
  onSubmit,
  onGoogleSignIn,
  onForgotPassword,
  buttonText,
  showGoogleSignInButton = true,
  error,
  children,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [localError, setLocalError] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    try {
      await onSubmit(email, password, keepLoggedIn);
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border-none rounded-full bg-gray-100"
      />
      <span className="block h-1" />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-3 py-2 border-none rounded-full bg-gray-100"
      />
      {/* Show forgot password only for signin */}
      {mode === "signin" && onForgotPassword && (
        <div className="text-left">
          <button
            type="button"
            onClick={() => onForgotPassword(email)}
            className="text-sm text-primary dark:text-gray-100 hover:underline"
            disabled={!email}
          >
            Forgot your password?
          </button>
        </div>
      )}
      {mode === "signin" && (
        <div className="mb-2">
          <Checkbox
            checked={keepLoggedIn}
            onChange={setKeepLoggedIn}
            label="Keep me logged in"
          />
        </div>
      )}
      {(error || localError) && (
        <div className="text-red-500">{error || localError}</div>
      )}
      <button
        type="submit"
        className="w-full py-2 mt-4 bg-primary text-white rounded-full hover:bg-primary-hover transition"
      >
        {buttonText || (mode === "signup" ? "Register" : "Sign In")}
      </button>
      {showGoogleSignInButton && onGoogleSignIn && (
        <>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-500" />
            <span className="mx-4 text-gray-500 dark:text-gray-300">or</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-500" />
          </div>
          <GoogleSignInButton onClick={onGoogleSignIn} />
        </>
      )}
      {children}
    </form>
  );
}
