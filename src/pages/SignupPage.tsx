import {
  AuthCard,
  AuthFooter,
  AuthForm,
  useAuthHandlers,
} from "@features/user";
import { usePageTitle } from "@hooks";

export default function SignupPage() {
  const { error, handleSignUp, handleGoogleSignIn } = useAuthHandlers();

  // Set the page title
  usePageTitle("Sign Up | Atlaset");

  return (
    <div className="flex flex-col flex-1 min-h-[70vh] w-full">
      <div className="flex flex-1 flex-col items-center justify-center">
        <AuthCard>
          <h2 className="text-2xl font-bold mb-4">
            Track your journeys and adventures around the world
          </h2>
          <AuthForm
            mode="signup"
            onSubmit={handleSignUp}
            onGoogleSignIn={handleGoogleSignIn}
            buttonText="Sign Up"
            error={error}
          />
        </AuthCard>
        <AuthFooter
          prompt="Already have an account?"
          linkText="Sign In"
          linkTo="/login"
        />
      </div>
    </div>
  );
}
