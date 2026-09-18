import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SplashScreen } from "@components";
import { useSettings } from "@features/settings";
import { useAnalytics } from "@features/settings/privacy/hooks/useAnalytics";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { warmUpBackend } from "@lib/api-client/backend";

interface AppBootstrapProps {
  children: ReactNode;
}

/** Waits for application-level state to initialize before rendering the rest of the application. */
export function AppBootstrap({ children }: AppBootstrapProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, ready: authReady, loading: authLoading } = useAuth();
  const { ready: settingsReady } = useSettings();

  const authBooting = !authReady || authLoading;
  const settingsBooting = Boolean(user) && !settingsReady;
  const needsInitialRedirect =
    !authBooting && Boolean(user) && location.pathname === "/";

  useAnalytics();

  // Warm up the backend to reduce initial request latency
  useEffect(() => {
    warmUpBackend();
  }, []);

  // Redirect to the main application page if the user is authenticated and on the root path
  useEffect(() => {
    if (needsInitialRedirect) {
      navigate("/atlas", {
        replace: true,
      });
    }
  }, [needsInitialRedirect, navigate]);

  if (authBooting || settingsBooting || needsInitialRedirect) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
