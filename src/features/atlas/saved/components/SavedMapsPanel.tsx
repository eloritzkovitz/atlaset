import { FaBookmark, FaFloppyDisk, FaPlus, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { useUI } from "@contexts/UIContext";
import { SavedMapPanelItem } from "./SavedMapPanelItem";

export function SavedMapsPanel() {
  const {
    savedMaps,
    createNewMap,
    saveCurrentMap,
    viewSavedMap,
    isSavedMapModalOpen,
    deleteSavedMap,
    updateSavedMapName,
  } = useSavedMaps();
  const { isReadonly } = useMapView();
  const { showSaved, toggleSaved } = useUI();

  return (
    <Panel
      title={
        <>
          <FaBookmark /> My Maps
        </>
      }
      show={showSaved}
      onHide={toggleSaved}
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
            onClick={toggleSaved}
            ariaLabel="Close Saved Panel"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </>
      }
    >
      <div className="mt-4">
        <ul className="list-none p-0">
          {savedMaps.length === 0 && (
            <li className="text-muted px-4 py-2">No saved maps yet.</li>
          )}
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
              onRemove={() => deleteSavedMap(map.id)}
              showRemove={true}
            />
          ))}
        </ul>
      </div>
    </Panel>
  );
}
