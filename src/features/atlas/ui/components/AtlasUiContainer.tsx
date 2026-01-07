import { useMarkers } from "@contexts/MarkersContext";
import { useLayers } from "@contexts/LayersContext";
import { CountryDetailsModal, CountriesPanel } from "@features/atlas/countries";
import { MapExportPanel } from "@features/atlas/export";
import {
  MarkerDetailsModal,
  MarkerModal,
  MarkersPanel,
  useMarkerCreation,
} from "@features/atlas/markers";
import { LayerModal, LayersPanel } from "@features/atlas/layers";
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

  // Markers state
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
        onEditLayer={openEditLayer}
        onAddLayer={openAddLayer}
        layerModalOpen={isEditModalOpen}
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
        marker={editingMarker}
        onChange={setEditingMarker}
        onSave={saveMarker}
        onClose={() => {
          closeMarkerModal();
          cancelMarkerCreation();
        }}
        isOpen={isMarkerModalOpen}
        isEditing={isEditingMarker}
      />
      <LayerModal
        isOpen={isEditModalOpen}
        isEditing={isEditingLayer}
        layer={editingLayer}
        onChange={setEditingLayer}
        onSave={saveLayer}
        onClose={closeLayerModal}
      />
    </>
  );
}
