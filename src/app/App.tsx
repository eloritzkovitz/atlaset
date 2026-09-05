import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SplashScreen, PwaUpdateUiHint, UIHintContainer } from "@components";
import { CookieConsentModal } from "@features/settings/privacy/components/CookieConsentModal";
import { useSettings } from "@features/settings";
import { useAnalytics } from "@features/settings/privacy/hooks/useAnalytics";
import { useAuth } from "@features/user/auth/hooks/useAuth";
import { MigrationModal } from "@features/user/migration/components/MigrationModal";
import { warmUpBackend } from "@lib/api-client/backend";
import { AppProviders } from "./providers/AppProviders";
import { AppRoutes } from "./routes/AppRoutes";

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

  // Initialize analytics tracking
  useAnalytics();

  // Warm up the backend on initial load
  useEffect(() => {
    warmUpBackend();
  }, []);

  // Redirect to /atlas if the user is logged in and on the root path
  useEffect(() => {
    if (needsInitialRedirect) {
      navigate("/atlas", {
        replace: true,
      });
    }
  }, [needsInitialRedirect, navigate]);

  // Show splash screen while waiting for auth or settings to be ready, or if we need to redirect
  if (authBooting || settingsBooting || needsInitialRedirect) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

/** Main application component. */
export default function App() {
  return (
    <AppProviders>
      <AppBootstrap>
        <CookieConsentModal />
        <MigrationModal />
        <UIHintContainer />
        <PwaUpdateUiHint />
        <AppRoutes />
      </AppBootstrap>
    </AppProviders>
  );
}
