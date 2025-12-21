import { useMarkers } from "@contexts/MarkersContext";
import { useOverlays } from "@contexts/OverlaysContext";
import { CountryDetailsModal, CountriesPanel } from "@features/atlas/countries";
import { MapExportPanel } from "@features/atlas/export";
import {
  MarkerDetailsModal,
  MarkerModal,
  MarkersPanel,
  useMarkerCreation,
} from "@features/atlas/markers";
import { OverlayModal, OverlaysPanel } from "@features/atlas/overlays";
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
  centerOnCountry: (iso: string) => void;
  centerOnMarker: (markerId: string) => void;
}

export function AtlasUiContainer({
  svgRef,
  selectedIsoCode,
  setSelectedIsoCode,
  hoveredIsoCode,
  setHoveredIsoCode,
  selectedCountry,
  setSelectedCountry,
  centerOnCountry,
  centerOnMarker,
}: AtlasUiContainerProps) {
  // Data state
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

  // Overlays state
  const {
    editingOverlay,
    isEditingOverlay,
    isEditModalOpen,
    openAddOverlay,
    openEditOverlay,
    saveOverlay,
    closeOverlayModal,
    setEditingOverlay,
  } = useOverlays();

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
        onCenterMap={(marker) => centerOnMarker(marker.id)}
      />
      <OverlaysPanel
        onEditOverlay={openEditOverlay}
        onAddOverlay={openAddOverlay}
        overlayModalOpen={isEditModalOpen}
      />
      <MapExportPanel svgRef={svgRef} />
      <SettingsPanel />

      {/* Modals */}
      <CountryDetailsModal
        isOpen={!!selectedCountry}
        country={selectedCountry}
        onCenterMap={() => centerOnCountry(selectedCountry?.isoCode ?? "")}
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
      <OverlayModal
        isOpen={isEditModalOpen}
        isEditing={isEditingOverlay}
        overlay={editingOverlay}
        onChange={setEditingOverlay}
        onSave={saveOverlay}
        onClose={closeOverlayModal}
      />
    </>
  );
}
