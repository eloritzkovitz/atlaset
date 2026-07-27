import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PwaUpdateUiHint, SplashScreen, UIHintContainer } from "@components";
import { AchievementsProvider } from "@contexts/AchievementsProvider";
import { TripsProvider } from "@contexts/TripsProvider";
import { UIProvider } from "@contexts/UIProvider";
import { UIHintProvider } from "@contexts/UIHintProvider";
import {
  CookieConsentModal,
  useAnalytics,
  useSettings,
} from "@features/settings";
import { AppLayout, PublicLayout } from "@layouts";
import AboutPage from "./pages/AboutPage";
import ActivityPage from "./pages/ActivityPage";
import ChangelogPage from "./pages/ChangelogPage";
import DashboardPage from "./pages/DashboardPage";
import DocsPage from "./pages/DocsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ProfilePage from "./pages/ProfilePage";
import QuizzesPage from "./pages/QuizzesPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignupPage";
import TripsPage from "./pages/TripsPage";
import { ProtectedRoute } from "./shared/router/ProtectedRoute";

// Lazy-loaded pages
const AtlasProviders = lazy(() =>
  import("./pages/AtlasProviders").then((m) => ({ default: m.AtlasProviders })),
);

function App() {
  const { ready } = useSettings();

  useAnalytics();

  // Show splash screen while settings are loading
  if (!ready) {
    return <SplashScreen />;
  }

  return (
    <AchievementsProvider>
      <TripsProvider>
        <UIProvider>
          <UIHintProvider>
            <CookieConsentModal />
            <UIHintContainer />
            <PwaUpdateUiHint />
            <Routes>
              <Route
                path="/"
                element={
                  <PublicLayout showAuthButtons>
                    <HomePage />
                  </PublicLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicLayout>
                    <LoginPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicLayout>
                    <SignupPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <PublicLayout>
                    <AboutPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PublicLayout>
                    <PrivacyPolicyPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/changelog"
                element={
                  <PublicLayout>
                    <ChangelogPage />
                  </PublicLayout>
                }
              />
              <Route path="/docs/*" element={<DocsPage />} />
              <Route
                path="/atlas"
                element={
                  <Suspense fallback={<SplashScreen />}>
                    <AtlasProviders />
                  </Suspense>
                }
              />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quizzes/*"
                element={
                  <AppLayout>
                    <QuizzesPage />
                  </AppLayout>
                }
              />
              <Route
                path="/trips"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TripsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:username/*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ActivityPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SearchPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <NotFoundPage />
                  </PublicLayout>
                }
              />
            </Routes>
          </UIHintProvider>
        </UIProvider>
      </TripsProvider>
    </AchievementsProvider>
  );
}

export default App;
