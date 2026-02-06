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
import { SavedMapsModal } from "@features/atlas/saved";
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

  // Markers state
  const mainMarkers = useMarkers();
  const savedMaps = useSavedMaps();

  const { startAddingMarker, cancelMarkerCreation } = useMarkerCreation();

  // Layers state
  const {
    editingLayer,
    isEditingLayer,
    isEditModalOpen,
    openAddLayer,
    openEditLayer,
    saveLayer,
    closeLayerModal,
    setEditingLayer,
  } = useLayers();

  // Saved maps state
  const {
    isSavedMapModalOpen,
    editingSavedMap,
    openSavedMapModal,
    closeSavedMapModal,
    saveSavedMap,
    addLayer,
    importLayers,
    reorderLayers,
    toggleLayerVisibility,
    removeLayer,
    isEditingSavedMapLayer,
    isEditSavedMapLayerModalOpen,
    editingSavedMapLayer,
    setEditingSavedMapLayer,
    saveSavedMapLayer,
    openAddLayer: openAddSavedMapLayer,
    openEditLayer: openEditSavedMapLayer,
    closeLayerModal: closeSavedMapLayer,
    // Marker fields
    editingSavedMapMarker,
    setEditingSavedMapMarker,
    isEditingSavedMapMarker,
    isEditSavedMapMarkerModalOpen,
    openEditMarker,
    saveSavedMapMarker,
    closeMarkerModal,
  } = savedMaps;

  // UI toggle hint
  useUiToggleHint();

  return (
    <>
      {/* Panels */}
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
        onEditMarker={isEdit ? openEditMarker : mainMarkers.openEditMarker}
        editingSavedMapMarkers={isEdit && editingSavedMap ? savedMaps.savedMapMarkers : undefined}
        handleSavedMapChange={
          isEdit
            ? {
                removeMarker: savedMaps.removeMarker,
                toggleMarkerVisibility: savedMaps.toggleMarkerVisibility,
                reorderMarkers: savedMaps.reorderMarkers,
              }
            : undefined
        }
      />
      <LayersPanel
        onEditLayer={isEdit ? openEditSavedMapLayer : openEditLayer}
        onAddLayer={isEdit ? openAddSavedMapLayer : openAddLayer}
        layerModalOpen={isEdit ? isEditSavedMapLayerModalOpen : isEditModalOpen}
        editingSavedMapLayers={
          isEdit && editingSavedMap ? editingSavedMap.layers : undefined
        }
        handleSavedMapChange={
          isEdit
            ? {
                addLayer,
                importLayers,
                reorderLayers,
                toggleLayerVisibility,
                removeLayer,
              }
            : undefined
        }
      />
      <MapExportPanel svgRef={svgRef} />
      <MapSettingsPanel />

      {/* Modals */}
      <CountryDetailsModal
        isOpen={!!selectedCountry}
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
      <MarkerDetailsModal
        isOpen={
          isEdit ? isEditSavedMapMarkerModalOpen : mainMarkers.detailsModalOpen
        }
        marker={isEdit ? editingSavedMapMarker : mainMarkers.selectedMarker}
        position={isEdit ? null : (mainMarkers.detailsModalPosition ?? null)}
        onClose={() =>
          isEdit ? closeMarkerModal() : mainMarkers.closeMarkerDetails()
        }
      />
      <MarkerModal
        isOpen={
          isEdit ? isEditSavedMapMarkerModalOpen : mainMarkers.isMarkerModalOpen
        }
        isEditing={
          isEdit ? isEditingSavedMapMarker : mainMarkers.isEditingMarker
        }
        marker={isEdit ? editingSavedMapMarker : mainMarkers.editingMarker}
        onChange={
          isEdit ? setEditingSavedMapMarker : mainMarkers.setEditingMarker
        }
        onSave={isEdit ? saveSavedMapMarker : mainMarkers.saveMarker}
        onClose={() => {
          if (isEdit) {
            closeMarkerModal();
          } else {
            mainMarkers.closeMarkerModal();
            cancelMarkerCreation();
          }
        }}
      />
      {/* LayerModal for main map or saved map layers */}
      {isEdit ? (
        <LayerModal
          isOpen={isEditSavedMapLayerModalOpen}
          isEditing={isEditingSavedMapLayer}
          layer={editingSavedMapLayer}
          onChange={setEditingSavedMapLayer}
          onSave={saveSavedMapLayer}
          onClose={closeSavedMapLayer}
        />
      ) : (
        <LayerModal
          isOpen={isEditModalOpen}
          isEditing={isEditingLayer}
          layer={editingLayer}
          onChange={setEditingLayer}
          onSave={saveLayer}
          onClose={closeLayerModal}
        />
      )}
      <SavedMapsModal
        isOpen={isSavedMapModalOpen}
        isEditing={!!(editingSavedMap && editingSavedMap.id)}
        savedMap={editingSavedMap}
        onChange={openSavedMapModal}
        onSave={saveSavedMap}
        onClose={closeSavedMapModal}
      />
    </>
  );
}
