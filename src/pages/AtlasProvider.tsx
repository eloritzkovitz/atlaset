import { lazy, Suspense } from "react";
import { LayersProvider } from "@contexts/LayersProvider";
import { MapViewProvider } from "@contexts/MapViewProvider";
import { MarkersProvider } from "@contexts/MarkersProvider";
import { SavedMapsProvider } from "@contexts/SavedMapsProvider";
import { TimelineProvider } from "@contexts/TimelineProvider";
import { SplashScreen } from "@components";

export function AtlasProviders() {
  const AtlasPage = lazy(() => import("./AtlasPage"));

  return (
    <Suspense fallback={<SplashScreen />}>
      <MapViewProvider>
        <SavedMapsProvider>
          <LayersProvider>
            <MarkersProvider>
              <TimelineProvider>
                <AtlasPage />
              </TimelineProvider>
            </MarkersProvider>
          </LayersProvider>
        </SavedMapsProvider>
      </MapViewProvider>
    </Suspense>
  );
}
