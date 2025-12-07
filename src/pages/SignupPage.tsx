import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm, GoogleSignInButton } from "@components";
import { signUp, signInWithGoogle } from "@services/authService";

export default function SignupPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/Password Sign-Up handler
  const handleSignUp = async (email: string, password: string) => {
    setError("");
    await signUp(email, password);
    navigate("/");
  };

  // Google Sign-Up handler
  const handleGoogleSignIn = async () => {
    setError("");
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Track your journeys and adventures around the world</h2>
      <AuthForm
        mode="signup"
        onSubmit={handleSignUp}
        error={error}
        buttonText="Sign Up"
      >
        <div className="my-4 text-center text-gray-500">or</div>
        <GoogleSignInButton onClick={handleGoogleSignIn} />
        <div className="mt-4 text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-800 dark:text-gray-200 font-semibold underline-offset-4 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
