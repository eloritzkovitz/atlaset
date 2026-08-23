import { useTranslation } from "react-i18next";
import { ActionButton, EmptyListMessage, Panel } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { useMapView } from "@features/atlas/map";
import { useAccessibility } from "@features/settings/accessibility";
import { SavedMapPanelItem } from "./SavedMapPanelItem";
import { useSavedMaps } from "../context/SavedMapsContext";

export function SavedMapsPanel() {
  const { animationsEnabled } = useAccessibility();
  const {
    savedMaps,
    createNewMap,
    duplicateSavedMap,
    saveCurrentMap,
    viewSavedMap,
    isSavedMapModalOpen,
    deleteSavedMap,
    updateSavedMapName,
  } = useSavedMaps();
  const { isReadonly } = useMapView();
  const { showSavedMaps, toggleSavedMaps } = useUI();
  const { t } = useTranslation("atlas");

  return (
    <Panel
      title={
        <>
          <ICONS.savedMaps /> {t("savedMaps.title")}
        </>
      }
      show={showSavedMaps}
      onHide={toggleSavedMaps}
      escEnabled={!isSavedMapModalOpen}
      position="left"
      headerActions={
        <>
          {isReadonly ? (
            <ActionButton
              onClick={saveCurrentMap}
              ariaLabel={t("savedMaps.save")}
              title={t("savedMaps.save")}
              icon={<ICONS.save />}
              rounded
            />
          ) : (
            <ActionButton
              onClick={createNewMap}
              ariaLabel={t("savedMaps.create")}
              title={t("savedMaps.create")}
              icon={<ICONS.add className="text-xl" />}
              rounded
            />
          )}
        </>
      }
      animationsEnabled={animationsEnabled}
    >
      <div className="mt-4">
        {savedMaps.length === 0 ? (
          <EmptyListMessage message={t("savedMaps.empty")} />
        ) : (
          <ul className="list-none p-0">
            {savedMaps.map((map) => (
              <SavedMapPanelItem
                key={map.id}
                map={map}
                onView={() => viewSavedMap(map)}
                onNameChange={(newName: string) => {
                  if (
                    newName &&
                    newName !== map.name &&
                    typeof updateSavedMapName === "function"
                  ) {
                    updateSavedMapName(map.id, newName);
                  }
                }}
                onDuplicate={() => duplicateSavedMap(map)}
                onRemove={() => deleteSavedMap(map)}
                showRemove={true}
              />
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
