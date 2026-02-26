import { FaBookmark, FaFloppyDisk, FaPlus, FaXmark } from "react-icons/fa6";
import { ActionButton, EmptyListMessage, Panel } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useUI } from "@contexts/UIContext";
import { SavedMapPanelItem } from "./SavedMapPanelItem";

export function SavedMapsPanel() {
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

  return (
    <Panel
      title={
        <>
          <FaBookmark /> My Maps
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
              ariaLabel="Save current map"
              title="Save current map"
              icon={<FaFloppyDisk />}
              rounded
            />
          ) : (
            <ActionButton
              onClick={createNewMap}
              ariaLabel="Create new map"
              title="Create new map"
              icon={<FaPlus className="text-xl" />}
              rounded
            />
          )}
          <ActionButton
            onClick={toggleSavedMaps}
            ariaLabel="Close Saved Panel"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </>
      }
    >
      <div className="mt-4">
        {savedMaps.length === 0 ? (
          <EmptyListMessage message="No saved maps yet." />
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
                onRemove={() => deleteSavedMap(map.id)}
                showRemove={true}
              />
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
