import { useRef } from "react";
import {
  FaLayerGroup,
  FaPlus,
  FaFileImport,
  FaFileExport,
  FaXmark,
} from "react-icons/fa6";
import { ActionButton, Panel } from "@components";
import { useLayers } from "@contexts/LayersContext";
import { useUI } from "@contexts/UIContext";
import { useDragReorder } from "@hooks";
import { LayerPanelItem } from "./LayerPanelItem";
import { importLayersFromFile, exportLayersToFile } from "../utils/layerIO";
import type { Layer } from "../types";

interface LayersPanelProps {
  onEditLayer: (layer: Layer) => void;
  onAddLayer: () => void;
  layerModalOpen: boolean;
}

export function LayersPanel({
  onEditLayer,
  onAddLayer,
  layerModalOpen,
}: LayersPanelProps) {
  const { showLayers, closePanel } = useUI();

  const {
    layers,
    importLayers,
    reorderLayers,
    toggleLayerVisibility,
    removeLayer,
  } = useLayers();

  // Drag state
  const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } =
    useDragReorder(layers, reorderLayers);

  // File input reference for importing layers
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Panel
      title={
        <>
          <FaLayerGroup />
          Layers
        </>
      }
      show={showLayers}
      onHide={closePanel}
      escEnabled={!layerModalOpen}
      headerActions={
        <>
          {/* Action buttons */}
          <ActionButton
            onClick={onAddLayer}
            ariaLabel="Add Layer"
            title="Add Layer"
            icon={<FaPlus />}
            rounded
          />
          <ActionButton
            onClick={() => fileInputRef.current?.click()}
            ariaLabel="Import Layers"
            title="Import Layers"
            icon={<FaFileImport />}
            rounded
          />
          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={(e) => importLayersFromFile(e, importLayers)}
            style={{ display: "none" }}
          />
          <ActionButton
            onClick={() => exportLayersToFile(layers)}
            ariaLabel="Export Layers"
            title="Export Layers"
            icon={<FaFileExport />}
            rounded
          />
          <ActionButton
            onClick={closePanel}
            ariaLabel="Close Layer Manager"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </>
      }
    >
      <ul className="list-none p-0">
        {layers.map((layer, index) => (
          <LayerPanelItem
            key={layer.id}
            layer={layer}
            onToggleVisibility={toggleLayerVisibility}
            onEdit={onEditLayer}
            onRemove={removeLayer}
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
