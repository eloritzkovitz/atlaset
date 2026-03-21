import { useMarkers } from "@contexts/MarkersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useLayers } from "@contexts/LayersContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { CountryDetailsModal, CountriesPanel } from "@features/atlas/countries";
import { MapExportPanel } from "@features/atlas/export";
import { LayerModal, LayersPanel } from "@features/atlas/layers";
import {
  MarkerDetailsModal,
  MarkerModal,
  MarkersPanel,
  useMarkerCreation,
} from "@features/atlas/markers";
import { SavedMapsModal, SavedMapsPanel } from "@features/atlas/saved";
import type { Country } from "@features/countries";
import { MapSettingsPanel } from "@features/settings";
import { useUiToggleHint } from "../hooks/useUiToggleHint";

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

  // UI toggle hint
  useUiToggleHint();

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
        onEditMarker={
          isEdit ? savedMaps.openEditMarker : mainMarkers.openEditMarker
        }
        activeSavedMapMarkers={
          isEdit && savedMaps.activeSavedMap
            ? savedMaps.savedMapMarkers
            : undefined
        }
        handleSavedMapChange={
          isEdit
            ? {
                updateMarkerName: savedMaps.updateMarkerName,
                toggleMarkerVisibility: savedMaps.toggleMarkerVisibility,
                reorderMarkers: savedMaps.reorderMarkers,
                duplicateMarker: savedMaps.duplicateMarker,
                removeMarker: savedMaps.removeMarker,
              }
            : undefined
        }
      />
      <LayersPanel
        onEditLayer={isEdit ? savedMaps.openEditLayer : layers.openEditLayer}
        onAddLayer={isEdit ? savedMaps.openAddLayer : layers.openAddLayer}
        layerModalOpen={
          isEdit
            ? savedMaps.isEditSavedMapLayerModalOpen
            : layers.isEditModalOpen
        }
        activeSavedMapLayers={
          isEdit && savedMaps.activeSavedMap
            ? savedMaps.activeSavedMap.layers
            : undefined
        }
        handleSavedMapChange={
          isEdit
            ? {
                addLayer: savedMaps.addLayer,
                updateLayerName: savedMaps.updateLayerName,
                editLayer: savedMaps.editLayer,
                importLayers: savedMaps.importLayers,
                reorderLayers: savedMaps.reorderLayers,
                toggleLayerVisibility: savedMaps.toggleLayerVisibility,
                duplicateLayer: savedMaps.duplicateLayer,
                removeLayer: savedMaps.removeLayer,
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
        isOpen={
          isEdit
            ? savedMaps.isEditSavedMapMarkerModalOpen
            : mainMarkers.detailsModalOpen
        }
        marker={
          isEdit ? savedMaps.activeSavedMapMarker : mainMarkers.selectedMarker
        }
        position={isEdit ? null : (mainMarkers.detailsModalPosition ?? null)}
        onClose={() =>
          isEdit
            ? savedMaps.closeMarkerModal()
            : mainMarkers.closeMarkerDetails()
        }
      />
      <MarkerModal
        isOpen={
          isEdit
            ? savedMaps.isEditSavedMapMarkerModalOpen
            : mainMarkers.isMarkerModalOpen
        }
        isEditing={
          isEdit
            ? savedMaps.isEditingSavedMapMarker
            : mainMarkers.isEditingMarker
        }
        marker={
          isEdit ? savedMaps.activeSavedMapMarker : mainMarkers.editingMarker
        }
        onChange={
          isEdit
            ? savedMaps.setActiveSavedMapMarker
            : mainMarkers.setEditingMarker
        }
        onSave={isEdit ? savedMaps.saveSavedMapMarker : mainMarkers.saveMarker}
        onClose={() => {
          if (isEdit) {
            savedMaps.closeMarkerModal();
          } else {
            mainMarkers.closeMarkerModal();
            cancelMarkerCreation();
          }
        }}
      />
      <LayerModal
        isOpen={
          isEdit
            ? savedMaps.isEditSavedMapLayerModalOpen
            : layers.isEditModalOpen
        }
        isEditing={
          isEdit ? savedMaps.isEditingSavedMapLayer : layers.isEditingLayer
        }
        layer={isEdit ? savedMaps.activeSavedMapLayer : layers.editingLayer}
        onChange={
          isEdit ? savedMaps.setActiveSavedMapLayer : layers.setEditingLayer
        }
        onSave={isEdit ? savedMaps.saveSavedMapLayer : layers.saveLayer}
        onClose={isEdit ? savedMaps.closeLayerModal : layers.closeLayerModal}
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
