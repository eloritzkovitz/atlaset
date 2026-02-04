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
import { useEffectiveLayers } from "@features/atlas/layers/hooks/useEffectiveLayers";

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
  const effectiveLayers = useEffectiveLayers();
  const isReadonly = effectiveLayers !== layers;

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
          {!isReadonly && (
            <>
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
            </>
          )}
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
      <div className="mt-4">
        <ul className="list-none p-0">
          {(effectiveLayers ?? []).map((layer, index) => (
            <LayerPanelItem
              key={layer.id}
              layer={layer}
              onToggleVisibility={
                !isReadonly ? toggleLayerVisibility : undefined
              }
              onEdit={!isReadonly ? onEditLayer : undefined}
              onRemove={!isReadonly ? removeLayer : undefined}
              dragged={draggedIndex === index}
              onDragStart={
                !isReadonly ? () => handleDragStart(index) : undefined
              }
              handleDragOver={
                !isReadonly ? (e) => handleDragOver(e, index) : undefined
              }
              handleDragEnd={!isReadonly ? handleDragEnd : undefined}
              showRemove={!isReadonly}
              showCenter={false}
            />
          ))}
        </ul>
      </div>
    </Panel>
  );
}
