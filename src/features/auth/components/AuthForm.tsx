import { useState } from "react";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
  buttonText?: string;
  children?: React.ReactNode;
}

export function AuthForm({
  mode,
  onSubmit,
  error,
  buttonText,
  children,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border-none rounded-full bg-gray-100"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-3 py-2 border-none rounded-full bg-gray-100"
      />
      {(error || localError) && (
        <div className="text-red-500">{error || localError}</div>
      )}
      <button
        type="submit"
        className="w-full py-2 mt-8 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition"
      >
        {buttonText || (mode === "signup" ? "Register" : "Sign In")}
      </button>
      {children}
    </form>
  );
}
