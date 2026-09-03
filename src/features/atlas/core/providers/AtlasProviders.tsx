import { useSearchParams } from "react-router-dom";
import { AppLayout, EmbedLayout } from "@app";
import AtlasPage from "../pages/AtlasPage";
import { CountryFiltersProvider } from "../../countries/context/CountryFiltersProvider";
import { CountryListsProvider } from "../../countries/context/CountryListsProvider";
import { LayersProvider } from "../../layers/context/LayersProvider";
import { MapViewProvider } from "../../map/context/MapViewProvider";
import { MarkersProvider } from "../../markers/context/MarkersProvider";
import { SavedMapsProvider } from "../../savedMaps/context/SavedMapsProvider";
import { TimelineProvider } from "../../timeline/context/TimelineProvider";

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

export default AtlasProviders;
