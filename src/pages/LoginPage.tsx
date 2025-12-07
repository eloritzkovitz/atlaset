import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm, GoogleSignInButton } from "@components";
import { signIn, signInWithGoogle } from "@services/authService";

export default function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/Password Sign-In handler
  const handleSignIn = async (email: string, password: string) => {
    setError("");
    await signIn(email, password);
    navigate("/");
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    setError("");
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <AuthForm
        mode="signin"
        onSubmit={handleSignIn}
        error={error}
        buttonText="Sign In"
      >
        <div className="my-4 text-center text-gray-500">or</div>
        <GoogleSignInButton onClick={handleGoogleSignIn} />
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-blue-600 underline">
            Don't have an account? Sign Up
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
