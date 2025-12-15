import {
  AuthCard,
  AuthFooter,
  AuthForm,
  AuthLayout,
  useAuthHandlers,
} from "@features/user";

export default function LoginPage() {
  const { error, handleSignIn, handleGoogleSignIn, handleForgotPassword } =
    useAuthHandlers();

  return (
    <AuthLayout>
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
    </AuthLayout>
  );
}
