import {
  AuthCard,
  AuthFooter,
  AuthForm,
  useAuthHandlers,
} from "@features/user";

export default function SignupPage() {
  const { error, handleSignUp, handleGoogleSignIn } = useAuthHandlers();

  return (
    <>
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
    </>
  );
}
