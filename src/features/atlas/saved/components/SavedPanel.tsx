import { FaBookmark, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel } from "@components";
import { useSavedMaps } from "@contexts/SavedMapsContext";
import { SavedMapPanelItem } from "./SavedMapPanelItem";

interface SavedPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SavedPanel({ open, onClose }: SavedPanelProps) {
  const {
    savedMaps,
    viewSavedMap,
    isSavedMapModalOpen,
    openSavedMapModal,
    deleteMap,
  } = useSavedMaps();

  return (
    <Panel
      title={
        <>
          <FaBookmark /> Saved
        </>
      }
      show={open}
      onHide={onClose}
      escEnabled={!isSavedMapModalOpen}
      position="right"
      headerActions={
        <ActionButton
          onClick={onClose}
          ariaLabel="Close Saved Panel"
          title="Close"
          icon={<FaXmark className="text-2xl" />}
          rounded
        />
      }
      className="!z-[10050]"
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
              onRename={() => openSavedMapModal(map)}
              onRemove={deleteMap}
              showRemove={true}
            />
          ))}
        </ul>
      </div>
    </Panel>
  );
}
