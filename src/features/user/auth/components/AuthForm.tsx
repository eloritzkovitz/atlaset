import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { ActionButton, Checkbox } from "@components";
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
  const [showPassword, setShowPassword] = useState(false);
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
        className="bg-input w-full px-3 py-2 border-none rounded-full"
      />
      <span className="block h-1" />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-input w-full px-3 py-2 border-none rounded-full"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted-hover"
          onClick={() => setShowPassword((v) => !v)}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
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
        <div className="text-danger">{error || localError}</div>
      )}
      <ActionButton
        type="submit"
        variant="primary"
        className="w-full py-2 mt-4 !rounded-full"
      >
        {buttonText || (mode === "signup" ? "Register" : "Sign In")}
      </ActionButton>
      {showGoogleSignInButton && onGoogleSignIn && (
        <>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-border" />
            <span className="mx-4 text-muted">or</span>
            <div className="flex-grow border-t border-border" />
          </div>
          <GoogleSignInButton onClick={onGoogleSignIn} />
        </>
      )}
      {children}
    </form>
  );
}
