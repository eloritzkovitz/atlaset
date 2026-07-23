import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, Checkbox, PasswordField } from "@components";
import { GoogleSignInButton } from "./GoogleSignInButton";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (
    email: string,
    password: string,
    keepLoggedIn: boolean,
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
  const { t } = useTranslation("auth");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    try {
      await onSubmit(email, password, keepLoggedIn);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError(String(err));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        id="email"
        name="email"
        type="email"
        placeholder={t("login.emailLabel", "Email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-input w-full px-3 py-2 border-none rounded-full"
      />
      <span className="block h-1" />
      <PasswordField
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("login.passwordLabel", "Password")}
        required
        className="bg-input w-full px-3 py-2 border-none rounded-full"
        hideLabel
        autoComplete="current-password"
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
            {t("login.forgotPassword", "Forgot your password?")}
          </button>
        </div>
      )}
      {mode === "signin" && (
        <div className="mb-2">
          <Checkbox
            checked={keepLoggedIn}
            onChange={setKeepLoggedIn}
            label={t("login.keepLoggedIn", "Keep me logged in")}
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
        {buttonText ||
          (mode === "signup"
            ? t("login.signupButton", "Register")
            : t("login.signinButton", "Sign in"))}
      </ActionButton>
      {showGoogleSignInButton && onGoogleSignIn && (
        <>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-border" />
            <span className="mx-4 text-muted">{t("login.or", "or")}</span>
            <div className="flex-grow border-t border-border" />
          </div>
          <GoogleSignInButton
            onClick={onGoogleSignIn}
            text={t("login.googleSignIn", "Sign in with Google")}
          />
        </>
      )}
      {children}
    </form>
  );
}
