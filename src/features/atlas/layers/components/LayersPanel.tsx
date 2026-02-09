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
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import { useEffectiveLayers } from "@features/atlas/layers";
import { useDragReorder } from "@hooks";
import { LayerPanelItem } from "./LayerPanelItem";
import type { Layer } from "../types";
import { importLayersFromFile, exportLayersToFile } from "../utils/layerIO";

interface LayersPanelProps {
  onEditLayer: (layer: Layer) => void;
  onAddLayer: () => void;
  layerModalOpen: boolean;
  activeSavedMapLayers?: Layer[];
  handleSavedMapChange?: {
    addLayer: (layer: Layer) => void;
    importLayers: (layers: Layer[]) => void;
    updateLayerName: (id: string, newName: string) => void;
    reorderLayers: (layers: Layer[]) => void;
    toggleLayerVisibility: (layerId: string) => void;
    removeLayer: (layerId: string) => void;
  };
}

export function LayersPanel({
  onEditLayer,
  onAddLayer,
  layerModalOpen,
  activeSavedMapLayers,
  handleSavedMapChange,
}: LayersPanelProps) {
  const { showLayers, closePanel } = useUI();
  const {
    layers,
    importLayers,
    updateLayerName,
    reorderLayers,
    toggleLayerVisibility,
    removeLayer,
  } = useLayers();
  const effectiveLayersFromContext = useEffectiveLayers();
  const effectiveLayers = activeSavedMapLayers ?? effectiveLayersFromContext;
  const isEditingSavedMap = !!activeSavedMapLayers && !!handleSavedMapChange;

  const { isReadonly } = useMapView();

  // Drag state
  const dragLayers = isEditingSavedMap ? activeSavedMapLayers! : layers;
  const dragReorder = isEditingSavedMap
    ? handleSavedMapChange?.reorderLayers
    : reorderLayers;
  const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } =
    useDragReorder(dragLayers, dragReorder);

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
                onChange={(e) => {
                  if (isEditingSavedMap && handleSavedMapChange) {
                    importLayersFromFile(e, handleSavedMapChange.importLayers);
                  } else {
                    importLayersFromFile(e, importLayers);
                  }
                }}
                style={{ display: "none" }}
              />
            </>
          )}
          <ActionButton
            onClick={() => exportLayersToFile(effectiveLayers)}
            ariaLabel="Export Layers"
            title="Export Layers"
            icon={<FaFileExport />}
            rounded
          />
          <ActionButton
            onClick={closePanel}
            ariaLabel="Close Layers Panel"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </>
      }
    >
      <div className="mt-4">
        {!effectiveLayers || effectiveLayers.length === 0 ? (
          <div className="mt-4 text-muted text-sm flex justify-center">
            No layers yet.
          </div>
        ) : (
          <ul className="list-none p-0">
            {effectiveLayers.map((layer, index) => (
              <LayerPanelItem
                key={layer.id}
                layer={layer}
                onToggleVisibility={
                  !isReadonly
                    ? isEditingSavedMap
                      ? handleSavedMapChange?.toggleLayerVisibility
                      : toggleLayerVisibility
                    : undefined
                }
                onDownload={
                  !isReadonly ? () => exportLayersToFile(layer) : undefined
                }
                onEdit={!isReadonly ? onEditLayer : undefined}
                onNameChange={
                  !isReadonly
                    ? isEditingSavedMap
                      ? (newName) =>
                          handleSavedMapChange?.updateLayerName(
                            layer.id,
                            newName,
                          )
                      : (newName) => updateLayerName(layer.id, newName)
                    : undefined
                }
                onRemove={
                  !isReadonly
                    ? isEditingSavedMap
                      ? handleSavedMapChange?.removeLayer
                      : removeLayer
                    : undefined
                }
                dragged={draggedIndex === index}
                onDragStart={
                  !isReadonly ? () => handleDragStart(index) : undefined
                }
                handleDragOver={
                  !isReadonly ? (e) => handleDragOver(e, index) : undefined
                }
                handleDragEnd={!isReadonly ? handleDragEnd : undefined}
              />
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
