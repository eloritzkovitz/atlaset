import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage, Panel } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { useCountryLists } from "@features/atlas/countries/context/CountryListsContext";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { useAccessibility } from "@features/settings";
import { useDragReorder } from "@hooks";
import { LayerPanelItem } from "./LayerPanelItem";
import { useLayers } from "../context/LayersContext";
import { useEffectiveLayers } from "../hooks/useEffectiveLayers";
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
  const { animationsEnabled } = useAccessibility();
  const { createListFromLayer } = useCountryLists();
  const effectiveLayersFromContext = useEffectiveLayers();
  const globalLayerActions = useLayers();
  const { isReadonly } = useMapView();
  const { t } = useTranslation("atlas");
  const { showLayers, closePanel } = useUI();

  const effectiveLayers = activeSavedMapLayers ?? effectiveLayersFromContext;
  const isEditingSavedMap = !!activeSavedMapLayers && !!handleSavedMapChange;

  // Resolve actions object (Saved Map vs Global Context)
  const actions = isEditingSavedMap
    ? handleSavedMapChange!
    : globalLayerActions;

  // Drag state
  const { draggedIndex, handleDragStart, handleDragOver, handleDragEnd } =
    useDragReorder(effectiveLayers, actions.reorderLayers);

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
                id="import-layers-file"
                name="import-layers-file"
                type="file"
                accept="application/json"
                ref={fileInputRef}
                onChange={(e) => importLayersFromFile(e, actions.importLayers)}
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
      animationsEnabled={animationsEnabled}
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
                    ? () => actions.toggleLayerVisibility(layer.id)
                    : undefined
                }
                onDownload={
                  !isReadonly ? () => exportLayersToFile(layer) : undefined
                }
                onEdit={!isReadonly ? () => onEditLayer(layer) : undefined}
                onNameChange={
                  !isReadonly
                    ? (newName) => actions.updateLayerName(layer.id, newName)
                    : undefined
                }
                onDuplicate={
                  !isReadonly
                    ? () => actions.duplicateLayer(layer.id)
                    : undefined
                }
                onCreateList={
                  !isReadonly
                    ? async () => {
                        await createListFromLayer(layer, (newListId) => {
                          actions.editLayer({ ...layer, listId: newListId });
                        });
                      }
                    : undefined
                }
                onRemove={
                  !isReadonly ? () => actions.removeLayer(layer.id) : undefined
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
