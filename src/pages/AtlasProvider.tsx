import { lazy, Suspense } from "react";
import { LayersProvider } from "@contexts/LayersProvider";
import { MapViewProvider } from "@contexts/MapViewProvider";
import { MarkersProvider } from "@contexts/MarkersProvider";
import { TimelineProvider } from "@contexts/TimelineProvider";
import { SplashScreen } from "@components";

export function AtlasProviders() {
  const AtlasPage = lazy(() => import("./AtlasPage"));

  return (
    <Suspense fallback={<SplashScreen />}>
      <LayersProvider>
        <MapViewProvider>
          <MarkersProvider>
            <TimelineProvider>
              <AtlasPage />
            </TimelineProvider>
          </MarkersProvider>
        </MapViewProvider>
      </LayersProvider>
    </Suspense>
  );
}
