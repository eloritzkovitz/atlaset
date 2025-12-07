import { Link } from "react-router-dom";
import { AuthForm, useAuthHandlers } from "@features/auth";

export default function SignupPage() {
  const { error, handleSignUp, handleGoogleSignIn } = useAuthHandlers();

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
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
      </div>
      <div className="mt-8 text-center text-gray-700">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-800 dark:text-gray-200 font-semibold underline-offset-4 hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
