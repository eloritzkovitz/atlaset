import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage, Panel } from "@components";
import { ICONS } from "@constants/icons";
import { useCountryLists } from "@contexts/CountryListsContext";
import { useLayers } from "@contexts/LayersContext";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import { useEffectiveLayers } from "@features/atlas/layers";
import { useDragReorder } from "@hooks";
import { LayerPanelItem } from "./LayerPanelItem";
import type { Layer } from "../types";
import { importLayersFromFile, exportLayersToFile } from "../utils/layerIO";

interface LayersPanelProps {
  onAddLayer: () => void;
  onEditLayer: (layer: Layer) => void;
  layerModalOpen: boolean;
  activeSavedMapLayers?: Layer[];
  handleSavedMapChange?: {
    addLayer: (layer: Layer) => void;
    importLayers: (layers: Layer[]) => void;
    updateLayerName: (id: string, newName: string) => void;
    editLayer: (layer: Layer) => void;
    reorderLayers: (layers: Layer[]) => void;
    toggleLayerVisibility: (layerId: string) => void;
    duplicateLayer: (layerId: string) => void;
    removeLayer: (layerId: string) => void;
  };
}

export function LayersPanel({
  onAddLayer,
  onEditLayer,
  layerModalOpen,
  activeSavedMapLayers,
  handleSavedMapChange,
}: LayersPanelProps) {
  const { createListFromLayer } = useCountryLists();
  const { t } = useTranslation("atlas");
  const { showLayers, closePanel } = useUI();
  const {
    layers,
    importLayers,
    editLayer,
    updateLayerName,
    reorderLayers,
    toggleLayerVisibility,
    duplicateLayer,
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
          <ICONS.layers />
          {t("layers.title")}
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
                ariaLabel={t("layers.add")}
                title={t("layers.add")}
                icon={<ICONS.add />}
                rounded
              />
              <ActionButton
                onClick={() => fileInputRef.current?.click()}
                ariaLabel={t("layers.import")}
                title={t("layers.import")}
                icon={<ICONS.importFile />}
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
            ariaLabel={t("layers.export")}
            title={t("layers.export")}
            icon={<ICONS.exportFile />}
            rounded
          />
        </>
      }
    >
      <div className="mt-4">
        {!effectiveLayers || effectiveLayers.length === 0 ? (
          <EmptyListMessage message={t("layers.empty")} />
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
                onDuplicate={
                  !isReadonly
                    ? isEditingSavedMap
                      ? () => handleSavedMapChange?.duplicateLayer(layer.id)
                      : () => duplicateLayer(layer.id)
                    : undefined
                }
                onCreateList={
                  !isReadonly
                    ? async () => {
                        await createListFromLayer(layer, (newListId) => {
                          const update = { ...layer, listId: newListId };
                          if (isEditingSavedMap && handleSavedMapChange) {
                            handleSavedMapChange.editLayer(update);
                          } else {
                            editLayer(update);
                          }
                        });
                      }
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
