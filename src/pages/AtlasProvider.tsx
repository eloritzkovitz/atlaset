import { lazy, Suspense } from "react";
import { SplashScreen } from "@components";
import { CountryListsProvider } from "@contexts/CountryListsProvider";
import { LayersProvider } from "@contexts/LayersProvider";
import { MapViewProvider } from "@contexts/MapViewProvider";
import { MarkersProvider } from "@contexts/MarkersProvider";
import { SavedMapsProvider } from "@contexts/SavedMapsProvider";
import { TimelineProvider } from "@contexts/TimelineProvider";

export function AtlasProviders() {
  const AtlasPage = lazy(() => import("./AtlasPage"));

  return (
    <Suspense fallback={<SplashScreen />}>
      <MapViewProvider>
        <CountryListsProvider>
          <SavedMapsProvider>
            <LayersProvider>
              <MarkersProvider>
                <TimelineProvider>
                  <AtlasPage />
                </TimelineProvider>
              </MarkersProvider>
            </LayersProvider>
          </SavedMapsProvider>
        </CountryListsProvider>
      </MapViewProvider>
    </Suspense>
  );
}
