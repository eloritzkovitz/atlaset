import { useRef } from "react";
import {
  FaLayerGroup,
  FaPlus,
  FaFileImport,
  FaFileExport,
  FaXmark,
} from "react-icons/fa6";
import { ActionButton, ErrorMessage, LoadingSpinner, Panel } from "@components";
import { useOverlays } from "@contexts/OverlaysContext";
import { useUI } from "@contexts/UIContext";
import {
  importOverlaysFromFile,
  exportOverlaysToFile,
} from "@features/atlas/overlays/utils/overlayFile";
import { useDragReorder } from "@hooks/useDragReorder";
import type { Overlay } from "@types";
import { OverlayPanelItem } from "./OverlayPanelItem";

interface OverlaysPanelProps {
  onEditOverlay: (overlay: Overlay) => void;
  onAddOverlay: () => void;
  overlayModalOpen: boolean;
};

export function OverlaysPanel({
  onEditOverlay,
  onAddOverlay,
  overlayModalOpen,
}: OverlaysPanelProps) {
  const { showOverlays, closePanel } = useUI();

  const {
    overlays,
    importOverlays,
    reorderOverlays,
    toggleOverlayVisibility,
    removeOverlay,
    loading,
    error,
  } = useOverlays();

  // Drag state
  const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } =
    useDragReorder(overlays, reorderOverlays);

  // File input reference for importing overlays
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show loading or error states
  if (loading) return <LoadingSpinner message="Loading overlays..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Panel
      title={
        <>
          <FaLayerGroup />
          Overlays
        </>
      }
      show={showOverlays}
      onHide={closePanel}
      escEnabled={!overlayModalOpen}
      headerActions={
        <>
          {/* Action buttons */}
          <ActionButton
            onClick={onAddOverlay}
            ariaLabel="Add Overlay"
            title="Add Overlay"
          >
            <FaPlus />
          </ActionButton>
          <ActionButton
            onClick={() => fileInputRef.current?.click()}
            ariaLabel="Import Overlays"
            title="Import Overlays"
          >
            <FaFileImport />
          </ActionButton>
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={(e) => importOverlaysFromFile(e, importOverlays)}
            style={{ display: "none" }}
          />
          <ActionButton
            onClick={() => exportOverlaysToFile(overlays)}
            ariaLabel="Export Overlays"
            title="Export Overlays"
          >
            <FaFileExport />
          </ActionButton>
          <ActionButton
            onClick={closePanel}
            ariaLabel="Close Overlay Manager"
            title="Close"
            className="action-btn action-btn-close"
          >
            <FaXmark />
          </ActionButton>
        </>
      }
    >
      <ul className="list-none p-0">
        {overlays.map((overlay, index) => (
          <OverlayPanelItem
            key={overlay.id}
            overlay={overlay}
            onToggleVisibility={toggleOverlayVisibility}
            onEdit={onEditOverlay}
            onRemove={removeOverlay}
            dragged={draggedIndex === index}
            onDragStart={() => handleDragStart(index)}
            handleDragOver={(e) => handleDragOver(e, index)}
            handleDragEnd={handleDragEnd}
            showEdit={true}
            showCenter={false}
          />
        ))}
      </ul>
    </Panel>
  );
}
