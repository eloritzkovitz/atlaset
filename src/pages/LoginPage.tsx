import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import {
  AuthCard,
  AuthFooter,
  AuthForm,
  useAuthHandlers,
} from "@features/user";
import { useUiHint } from "@hooks";

export default function LoginPage() {
  const { error, handleSignIn, handleGoogleSignIn, handleForgotPassword } =
    useAuthHandlers();
  const [showReactivatedHint, setShowReactivatedHint] = useState(false);

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
          message: "Your account has been reactivated. Welcome back!",
          icon: <FaCircleCheck color="#22c55e" />,
        }
      : null,
    4000,
    { key: "reactivated-hint", dismissable: true },
  );

  return (
    <div className="flex flex-col flex-1 min-h-[70vh] w-full">
      <div className="flex flex-1 flex-col items-center justify-center">
        <AuthCard>
          <h2 className="text-2xl font-bold mb-4">Sign in</h2>
          <AuthForm
            mode="signin"
            onSubmit={handleSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            onForgotPassword={handleForgotPassword}
            buttonText="Sign In"
            error={error}
          />
        </AuthCard>
        <AuthFooter
          prompt="Don't have an account?"
          linkText="Sign Up"
          linkTo="/signup"
        />
      </div>
    </div>
  );
}
