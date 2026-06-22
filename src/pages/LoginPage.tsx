import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCircleCheck } from "react-icons/fa6";
import {
  AuthCard,
  AuthFooter,
  AuthForm,
  useAuthHandlers,
} from "@features/user";
import { useUiHint, usePageTitle } from "@hooks";

export default function LoginPage() {
  const { error, handleSignIn, handleGoogleSignIn, handleForgotPassword } =
    useAuthHandlers();
  const [showReactivatedHint, setShowReactivatedHint] = useState(false);
  const { t } = useTranslation("auth");

  // Set the page title
  usePageTitle(t("login.pageTitle", "Login"));

  // Show reactivation hint if needed
  useEffect(() => {
    if (sessionStorage.getItem("reactivated") === "1") {
      sessionStorage.removeItem("reactivated");
      setShowReactivatedHint(true);
    }
  }, []);

  useUiHint(
    showReactivatedHint
      ? {
          message: t(
            "login.reactivationHint",
            "Your account has been reactivated. Welcome back!",
          ),
          icon: <FaCircleCheck className="text-success" />,
        }
      : null,
    4000,
    { key: "reactivated-hint", dismissable: true },
  );

  return (
    <div className="flex flex-col flex-1 min-h-[70vh] w-full">
      <div className="flex flex-1 flex-col items-center justify-center">
        <AuthCard>
          <h2 className="text-2xl font-bold mb-4">
            {t("login.title", "Sign in")}
          </h2>
          <AuthForm
            mode="signin"
            onSubmit={handleSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            onForgotPassword={handleForgotPassword}
            error={error}
          />
        </AuthCard>
        <AuthFooter
          prompt={t("login.prompt", "Don't have an account?")}
          linkText={t("login.linkText", "Sign up")}
          linkTo="/signup"
        />
      </div>
    </div>
  );
}
