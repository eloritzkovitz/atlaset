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
            <AppLayout>
              <Routes>
                <Route
                  path="/"
                  element={
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
                  }
                />
                <Route path="/dashboard/*" element={<DashboardPage />} />
                <Route path="/game" element={<GamesPage />} />
                <Route path="/trips" element={<TripsPage />} />
              </Routes>
            </AppLayout>
          </UIHintProvider>
        </UIProvider>
      </TripsProvider>
    </CountryDataProvider>
  );
}

export default App;
