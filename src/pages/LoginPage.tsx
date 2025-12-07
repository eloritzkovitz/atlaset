import { Link } from "react-router-dom";
import { AuthForm, useAuthHandlers } from "@features/auth";

export default function LoginPage() {
  const { error, handleSignIn, handleGoogleSignIn, handleForgotPassword } = useAuthHandlers();

  return (
    <>
      <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Sign in</h2>
        <AuthForm
          mode="signin"
          onSubmit={handleSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          onForgotPassword={handleForgotPassword}
          buttonText="Sign In"
          error={error}          
        />
      </div>
      <div className="mt-8 text-center text-gray-700">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-800 dark:text-gray-200 font-semibold underline-offset-4 hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
}
