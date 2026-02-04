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
import { SettingsPanel } from "@features/settings";
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
  const {
    editingMarker,
    setEditingMarker,
    isEditingMarker,
    isMarkerModalOpen,
    saveMarker,
    openEditMarker,
    closeMarkerModal,
    selectedMarker,
    detailsModalOpen,
    detailsModalPosition,
    closeMarkerDetails,
  } = useMarkers();

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
    importLayers,
    reorderLayers,
    toggleLayerVisibility,
    removeLayer,
    isEditingSavedMapLayer,
    isEditSavedMapLayerModalOpen,
    editingSavedMapLayer,
    setEditingSavedMapLayer,
    saveSavedMapLayer,
    openEditSavedMapLayerModal,
    closeSavedMapLayerModal,
  } = useSavedMaps();

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
        onEditMarker={openEditMarker}
      />
      <LayersPanel
        onEditLayer={isEdit ? openEditSavedMapLayerModal : openEditLayer}
        onAddLayer={openAddLayer}
        layerModalOpen={isEdit ? isEditSavedMapLayerModalOpen : isEditModalOpen}
        editingSavedMapLayers={
          isEdit && editingSavedMap ? editingSavedMap.layers : undefined
        }
        handleSavedMapChange={
          isEdit
            ? {
                importLayers,
                reorderLayers,
                toggleLayerVisibility,
                removeLayer,
              }
            : undefined
        }
      />
      <MapExportPanel svgRef={svgRef} />
      <SettingsPanel />

      {/* Modals */}
      <CountryDetailsModal
        isOpen={!!selectedCountry}
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
      <MarkerDetailsModal
        isOpen={detailsModalOpen}
        marker={selectedMarker}
        position={detailsModalPosition}
        onClose={() => closeMarkerDetails()}
      />
      <MarkerModal
        isOpen={isMarkerModalOpen}
        isEditing={isEditingMarker}
        marker={editingMarker}
        onChange={setEditingMarker}
        onSave={saveMarker}
        onClose={() => {
          closeMarkerModal();
          cancelMarkerCreation();
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
          onClose={closeSavedMapLayerModal}
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
