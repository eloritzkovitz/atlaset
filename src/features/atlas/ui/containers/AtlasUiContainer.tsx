import { useUiToggleHint } from "@features/atlas/core";
import { CountryDetailsModal, CountriesPanel } from "@features/atlas/countries";
import { MapExportPanel } from "@features/atlas/export";
import { LayerModal, LayersPanel, useLayers } from "@features/atlas/layers";
import { useMapView } from "@features/atlas/map";
import {
  MarkerDetailsModal,
  MarkerModal,
  MarkersPanel,
  useMarkerCreation,
  useMarkers,
} from "@features/atlas/markers";
import {
  SavedMapsModal,
  SavedMapsPanel,
  useSavedMaps,
} from "@features/atlas/savedMaps";
import { MapSettingsPanel } from "@features/atlas/settings";
import type { Country } from "@features/countries/types";

interface AtlasUiContainerProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  selectedIsoCode: string | null;
  setSelectedIsoCode: (iso: string | null) => void;
  hoveredIsoCode: string | null;
  setHoveredIsoCode: (iso: string | null) => void;
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
}

export function AtlasUiContainer({
  svgRef,
  selectedIsoCode,
  setSelectedIsoCode,
  hoveredIsoCode,
  setHoveredIsoCode,
  selectedCountry,
  setSelectedCountry,
}: AtlasUiContainerProps) {
  const { isEdit } = useMapView();
  const layers = useLayers();
  const mainMarkers = useMarkers();
  const { startAddingMarker, cancelMarkerCreation } = useMarkerCreation();
  const savedMaps = useSavedMaps();

  useUiToggleHint();

  // Select active sub-managers based on view mode
  const activeMarkers = isEdit ? savedMaps.markers : mainMarkers;
  const activeLayers = isEdit ? savedMaps.layers : layers;

  return (
    <>
      <CountriesPanel
        selectedIsoCode={selectedIsoCode}
        hoveredIsoCode={hoveredIsoCode}
        selectedCountry={selectedCountry}
        onSelect={setSelectedIsoCode}
        onHover={setHoveredIsoCode}
        onCountryInfo={setSelectedCountry}
      />
      <MarkersPanel
        onAddMarker={startAddingMarker}
        onEditMarker={activeMarkers.openEditMarker}
        activeSavedMapMarkers={
          isEdit && savedMaps.activeSavedMap
            ? savedMaps.markers.markers
            : undefined
        }
        handleSavedMapChange={
          isEdit
            ? {
                updateMarkerName: savedMaps.markers.updateMarkerName,
                toggleMarkerVisibility:
                  savedMaps.markers.toggleMarkerVisibility,
                reorderMarkers: savedMaps.markers.reorderMarkers,
                removeMarker: savedMaps.markers.removeMarker,
              }
            : undefined
        }
      />
      <LayersPanel
        onEditLayer={activeLayers.openEditLayer}
        onAddLayer={activeLayers.openAddLayer}
        layerModalOpen={activeLayers.isEditModalOpen}
        activeSavedMapLayers={
          isEdit && savedMaps.activeSavedMap
            ? savedMaps.activeSavedMap.layers
            : undefined
        }
        handleSavedMapChange={
          isEdit
            ? {
                addLayer: savedMaps.layers.addLayer,
                updateLayerName: savedMaps.layers.updateLayerName,
                editLayer: savedMaps.layers.editLayer,
                importLayers: savedMaps.layers.importLayers,
                reorderLayers: savedMaps.layers.reorderLayers,
                toggleLayerVisibility: savedMaps.layers.toggleLayerVisibility,
                duplicateLayer: savedMaps.layers.duplicateLayer,
                removeLayer: savedMaps.layers.removeLayer,
              }
            : undefined
        }
      />
      <SavedMapsPanel />
      <MapExportPanel svgRef={svgRef} />
      <MapSettingsPanel />

      <CountryDetailsModal
        isOpen={!!selectedCountry}
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
      <MarkerDetailsModal
        isOpen={isEdit ? false : mainMarkers.detailsModalOpen}
        marker={isEdit ? null : mainMarkers.selectedMarker}
        position={isEdit ? null : (mainMarkers.detailsModalPosition ?? null)}
        onClose={mainMarkers.closeMarkerDetails}
      />
      <MarkerModal
        isOpen={activeMarkers.isMarkerModalOpen}
        isEditing={activeMarkers.isEditingMarker}
        marker={activeMarkers.editingMarker}
        onChange={activeMarkers.setEditingMarker}
        onSave={activeMarkers.saveMarker}
        onClose={() => {
          if (isEdit) {
            savedMaps.markers.closeMarkerModal();
          } else {
            mainMarkers.closeMarkerModal();
            cancelMarkerCreation();
          }
        }}
      />
      <LayerModal
        isOpen={activeLayers.isEditModalOpen}
        isEditing={activeLayers.isEditingLayer}
        layer={activeLayers.editingLayer}
        onChange={activeLayers.setEditingLayer}
        onSave={activeLayers.saveLayer}
        onClose={activeLayers.closeLayerModal}
      />
      <SavedMapsModal
        isOpen={savedMaps.isSavedMapModalOpen}
        isEditing={
          !!(
            savedMaps.activeSavedMap &&
            savedMaps.savedMaps.some(
              (m) => m.id === savedMaps.activeSavedMap?.id,
            )
          )
        }
        savedMap={savedMaps.activeSavedMap ?? null}
        onChange={savedMaps.openSavedMapModal}
        onSave={savedMaps.saveSavedMap}
        onClose={savedMaps.closeSavedMapModal}
      />
    </>
  );
}
