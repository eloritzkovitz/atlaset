import { useMarkers } from "@contexts/MarkersContext";
import { useOverlays } from "@contexts/OverlayContext";
import { CountryDetailsModal, CountriesPanel } from "@features/atlas/countries";
import {
  MarkerDetailsModal,
  MarkerModal,
  MarkersPanel,
  useMarkerCreation,
} from "@features/atlas/markers";
import { OverlayModal, OverlaysPanel } from "@features/atlas/overlays";
import { SettingsPanel } from "@features/settings";
import { MapExportPanel } from "../export/components/MapExportPanel";
import { MenuPanel } from "../menu/MenuPanel";
import { ShortcutsModal } from "../shortcuts/ShortcutsModal";

interface AtlasUiContainerProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  selectedIsoCode: string | null;
  setSelectedIsoCode: any;
  hoveredIsoCode: string | null;
  setHoveredIsoCode: any;
  selectedCountry: any;
  setSelectedCountry: any;
  showVisitedOnly: boolean;
  centerOnCountry: any;
  centerOnMarker: any;  
}

export function AtlasUiContainer({
  svgRef,
  selectedIsoCode,
  setSelectedIsoCode,
  hoveredIsoCode,
  setHoveredIsoCode,
  selectedCountry,
  setSelectedCountry,
  showVisitedOnly,
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

  return (
    <>
      {/* Panels */}
      <MenuPanel />
      <CountriesPanel
        selectedIsoCode={selectedIsoCode}
        hoveredIsoCode={hoveredIsoCode}
        selectedCountry={selectedCountry}
        showVisitedOnly={showVisitedOnly}
        onSelect={setSelectedIsoCode}
        onHover={setHoveredIsoCode}
        onCountryInfo={setSelectedCountry}        
      />
      <MarkersPanel
        onAddMarker={startAddingMarker}
        onEditMarker={openEditMarker}
        onCenterMap={centerOnMarker}
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
      <ShortcutsModal />
    </>
  );
}
