import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PwaUpdateUiHint, SplashScreen, UIHintContainer } from "@components";
import { MapUIProvider } from "@contexts/MapUIProvider";
import { MarkersProvider } from "@contexts/MarkersProvider";
import { OverlaysProvider } from "@contexts/OverlaysProvider";
import { useSettings } from "@contexts/SettingsContext";
import { TimelineProvider } from "@contexts/TimelineProvider";
import { TripsProvider } from "@contexts/TripsProvider";
import { UIProvider } from "@contexts/UIProvider";
import { UIHintProvider } from "@contexts/UIHintProvider";
import { AppLayout } from "@layout";
import DashboardPage from "./pages/DashboardPage";
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/users/:username" element={<ProfilePage />} />
            <Route path="/settings/*" element={<SettingsPage />} />
            <Route
              path="/"
              element={
                <AppLayout>
                  <Suspense fallback={<SplashScreen />}>
                    <OverlaysProvider>
                      <MapUIProvider>
                        <MarkersProvider>
                          <TimelineProvider>
                            <AtlasPage />
                          </TimelineProvider>
                        </MarkersProvider>
                      </MapUIProvider>
                    </OverlaysProvider>
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </UIHintProvider>
      </UIProvider>
    </TripsProvider>
  );
}

export default App;
