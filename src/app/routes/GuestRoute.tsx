import { Navigate, Outlet } from "react-router-dom";
import { SplashScreen } from "@components";
import { useAuth } from "@features/user/auth";
import { useSettings } from "@features/settings/common/hooks/useSettings";

interface GuestRouteProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

/** Allows unauthenticated users to access the route. Redirects authenticated users. */
export function GuestRoute({
  redirectTo = "/atlas",
  children,
}: GuestRouteProps) {
  const { user, loading, ready } = useAuth();
  const { ready: settingsReady } = useSettings();

  // Show splash screen while auth state is being determined
  if (!ready || loading || !settingsReady) {
    return <SplashScreen />;
  }

  // Redirect authenticated users to the specified route
  if (user) {
    return (
      <>
        <SplashScreen />
        <Navigate to={redirectTo} replace />
      </>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
