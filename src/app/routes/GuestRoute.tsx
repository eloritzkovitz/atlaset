import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@features/user/auth";

interface GuestRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

/** Allows unauthenticated users to access the route. Redirects authenticated users. */
export function GuestRoute({
  redirectTo = "/atlas",
  children,
}: GuestRouteProps) {
  const { user } = useAuth();

  // Redirect authenticated users to the specified route
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
