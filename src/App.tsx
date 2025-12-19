import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PwaUpdateUiHint, SplashScreen, UIHintContainer } from "@components";
import { CountryDataProvider } from "@contexts/CountryDataContext";
import { MapUIProvider } from "@contexts/MapUIContext";
import { MarkersProvider } from "@contexts/MarkersContext";
import { OverlaysProvider } from "@contexts/OverlaysContext";
import { useSettings } from "@contexts/SettingsContext";
import { TimelineProvider } from "@contexts/TimelineContext";
import { TripsProvider } from "@contexts/TripsContext";
import { UIProvider } from "@contexts/UIContext";
import { UIHintProvider } from "@contexts/UIHintContext";
import { AppLayout } from "@layout";
import DashboardPage from "./pages/DashboardPage";
import GamesPage from "./pages/GamesPage";
import TripsPage from "./pages/TripsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const { loading } = useSettings();

  // Lazy load AtlasPage
  const AtlasPage = lazy(() => import("./pages/AtlasPage"));

  // Show splash screen while loading settings
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <CountryDataProvider>
      <TripsProvider>
        <UIProvider>
          <UIHintProvider>
            <UIHintContainer />
            <PwaUpdateUiHint />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile/*" element={<ProfilePage />} />
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
                path="/game"
                element={
                  <AppLayout>
                    <GamesPage />
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
    </CountryDataProvider>
  );
}

export default App;
