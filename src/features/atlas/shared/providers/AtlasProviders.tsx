import { useSearchParams } from "react-router-dom";
import { CountryFiltersProvider } from "@contexts/CountryFiltersProvider";
import { CountryListsProvider } from "@contexts/CountryListsProvider";
import { LayersProvider } from "@contexts/LayersProvider";
import { MapViewProvider } from "@contexts/MapViewProvider";
import { MarkersProvider } from "@contexts/MarkersProvider";
import { SavedMapsProvider } from "@contexts/SavedMapsProvider";
import { TimelineProvider } from "@contexts/TimelineProvider";
import { AppLayout, EmbedLayout } from "@layouts";
import AtlasPage from "../../../../pages/AtlasPage";

export function AtlasProviders() {
  const [searchParams] = useSearchParams();
  const isEmbed = searchParams.has("embed");
  const mapCode = searchParams.get("map") || undefined;

  // Determine which layout to use based on the "embed" query parameter
  const Layout = isEmbed ? EmbedLayout : AppLayout;

  return (
    <MapViewProvider>
      <CountryListsProvider>
        <SavedMapsProvider>
          <LayersProvider>
            <MarkersProvider>
              <TimelineProvider>
                <CountryFiltersProvider>
                  <Layout mapCode={isEmbed ? mapCode : undefined}>
                    <AtlasPage />
                  </Layout>
                </CountryFiltersProvider>
              </TimelineProvider>
            </MarkersProvider>
          </LayersProvider>
        </SavedMapsProvider>
      </CountryListsProvider>
    </MapViewProvider>
  );
}
