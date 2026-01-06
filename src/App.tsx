import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PwaUpdateUiHint, SplashScreen, UIHintContainer } from "@components";
import { MapUIProvider } from "@contexts/MapUIProvider";
import { LayersProvider } from "@contexts/LayersProvider";
import { MarkersProvider } from "@contexts/MarkersProvider";
import { useSettings } from "@contexts/SettingsContext";
import { TimelineProvider } from "@contexts/TimelineProvider";
import { TripsProvider } from "@contexts/TripsProvider";
import { UIProvider } from "@contexts/UIProvider";
import { UIHintProvider } from "@contexts/UIHintProvider";
import { AppLayout, PublicLayout } from "@layout";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import QuizzesPage from "./pages/QuizzesPage";
import TripsPage from "./pages/TripsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { ready } = useSettings();

  const AtlasPage = lazy(() => import("./pages/AtlasPage"));

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
            <Route path="/users/:username" element={<ProfilePage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route
              path="/atlas"
              element={
                <AppLayout>
                  <Suspense fallback={<SplashScreen />}>
                    <LayersProvider>
                      <MapUIProvider>
                        <MarkersProvider>
                          <TimelineProvider>
                            <AtlasPage />
                          </TimelineProvider>
                        </MarkersProvider>
                      </MapUIProvider>
                    </LayersProvider>
                  </Suspense>
                </AppLayout>
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
                <PublicLayout>
                  <NotFoundPage />
                </PublicLayout>
              }
            />            
          </Routes>
        </UIHintProvider>
      </UIProvider>
    </TripsProvider>
  );
}

export default App;
