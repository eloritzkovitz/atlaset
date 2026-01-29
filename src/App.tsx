import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PwaUpdateUiHint, SplashScreen, UIHintContainer } from "@components";
import { useSettings } from "@contexts/SettingsContext";
import { TripsProvider } from "@contexts/TripsProvider";
import { UIProvider } from "@contexts/UIProvider";
import { UIHintProvider } from "@contexts/UIHintProvider";
import { AppLayout, EmbedLayout, PublicLayout } from "@layout";
import { AtlasProviders } from "./pages/AtlasProvider";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import QuizzesPage from "./pages/QuizzesPage";
import SettingsPage from "./pages/SettingsPage";
import TripsPage from "./pages/TripsPage";

// Lazy-loaded pages
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const { ready } = useSettings();

  // Show splash screen while settings are loading
  if (!ready) {
    return <SplashScreen />;
  }

  return (
    <TripsProvider>
      <UIProvider>
        <UIHintProvider>
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
                <Suspense>
                  <PublicLayout>
                    <LoginPage />
                  </PublicLayout>
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={
                <Suspense>
                  <PublicLayout>
                    <SignupPage />
                  </PublicLayout>
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense>
                  <PublicLayout>
                    <AboutPage />
                  </PublicLayout>
                </Suspense>
              }
            />
            <Route
              path="/changelog"
              element={
                <Suspense>
                  <PublicLayout>
                    <ChangelogPage />
                  </PublicLayout>
                </Suspense>
              }
            />
            <Route path="/users/:username" element={<ProfilePage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route
              path="/atlas"
              element={
                window.location.search.includes("embed") ? (
                  <EmbedLayout
                    mapCode={
                      new URLSearchParams(window.location.search).get("map") ||
                      undefined
                    }
                  >
                    <AtlasProviders />
                  </EmbedLayout>
                ) : (
                  <AppLayout>
                    <AtlasProviders />
                  </AppLayout>
                )
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
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
                <AppLayout>
                  <TripsPage />
                </AppLayout>
              }
            />
            <Route
              path="*"
              element={
                <Suspense>
                  <PublicLayout>
                    <NotFoundPage />
                  </PublicLayout>
                </Suspense>
              }
            />
          </Routes>
        </UIHintProvider>
      </UIProvider>
    </TripsProvider>
  );
}

export default App;
