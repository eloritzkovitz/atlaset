import { Link } from "react-router-dom";
import { AuthForm, GoogleSignInButton, useAuthHandlers } from "@features/auth";

export default function LoginPage() {
  const { error, handleSignIn, handleGoogleSignIn } = useAuthHandlers();

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      <AuthForm
        mode="signin"
        onSubmit={handleSignIn}
        error={error}
        buttonText="Sign In"
      >
        <div className="my-4 text-center text-gray-500">or</div>
        <GoogleSignInButton onClick={handleGoogleSignIn} />
        <div className="mt-4 text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-800 dark:text-gray-200 font-semibold underline-offset-4 hover:underline transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
