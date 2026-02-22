import React from "react";
import { ActionButton, Modal, PanelHeader } from "@components";
import { TripsCalendar } from "./TripsCalendar";
import { type Trip } from "../../types";
import { FaCalendarDay, FaXmark } from "react-icons/fa6";

interface TripsCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
}

export const TripsCalendarModal: React.FC<TripsCalendarModalProps> = ({
  isOpen,
  onClose,
  trips,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    className="w-[950px] max-h-[92vh] flex flex-col shadow"
    draggable
  >
    <PanelHeader
      title={
        <>
          <FaCalendarDay />
          Trips Calendar
        </>
      }
      showSeparator={true}
    >
      <ActionButton
        onClick={onClose}
        ariaLabel="Close"
        title="Close"
        icon={<FaXmark className="text-2xl" />}
        rounded
      />
    </PanelHeader>
    <div className="flex flex-col w-full h-full p-4">
      <TripsCalendar trips={trips} />
    </div>
  </Modal>
);
