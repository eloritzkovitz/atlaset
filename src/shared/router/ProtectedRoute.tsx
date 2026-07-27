import { Navigate } from "react-router-dom";
import { useAuth } from "@features/user/auth";

/** Protects a route by redirecting to login if not authenticated. */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
