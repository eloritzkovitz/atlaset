import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  PanelHeader,
  ModalActions,
  ActionButton,
  FormField,
} from "@components";
import { ICONS } from "@constants/icons";
import { useMapView } from "@contexts/MapViewContext";
import type { SavedMap } from "../types";

interface SavedMapsModalProps {
  isOpen: boolean;
  savedMap: SavedMap | null;
  onChange: (map: SavedMap) => void;
  onSave: () => void;
  onClose: () => void;
  isEditing: boolean;
}

export function SavedMapsModal({
  isOpen,
  savedMap,
  onChange,
  onSave,
  onClose,
  isEditing,
}: SavedMapsModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const { isReadonly } = useMapView();

  // Focus the name input when the modal opens
  useEffect(() => {
    if (isOpen && savedMap) {
      setName(savedMap.name ?? "");
      nameRef.current?.focus();
    }
  }, [isOpen, savedMap]);

  // Return null if the modal is not open or there's no saved map
  if (!isOpen || !savedMap) return null;

  // Handle changes to the map name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onChange({ ...savedMap, name: e.target.value });
  };

  const isValid = name.trim() !== "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-xl shadow-2xl !min-w-[400px] max-h-[90vh] overflow-y-auto"
      position="center"
      draggable
    >
      <PanelHeader
        title={
          <>
            <ICONS.saved />
            {isEditing ? "Rename Map" : isReadonly ? "Save Map" : "Add Map"}
          </>
        }
      >
        <ActionButton
          onClick={onClose}
          ariaLabel="Close Saved Map Modal"
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      </PanelHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) onSave();
        }}
      >
        <div className="p-6 flex flex-col gap-4">
          <FormField label="Map Name:">
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={handleNameChange}
              className="input input-bordered"
              placeholder="Map name"
            />
          </FormField>
        </div>
        <div className="flex items-center justify-end mt-6">
          <ModalActions
            onCancel={onClose}
            onSubmit={onSave}
            submitType="submit"
            submitIcon={
              isEditing ? (
                <ICONS.save className="inline" />
              ) : (
                <ICONS.add className="inline" />
              )
            }
            submitLabel={isEditing ? "Save Changes" : "Add Map"}
            disabled={!isValid}
          />
        </div>
      </form>
    </Modal>
  );
}
