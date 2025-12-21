import React, { useRef } from "react";
import { FaFileImport, FaFileExport, FaCheck } from "react-icons/fa6";
import { ActionButton, ConfirmModal } from "@components";
import { useTrips } from "@contexts/TripsContext";
import { useTripIO } from "@features/trips/hooks/useTripsIO";
import { useClickOutside } from "@hooks/useClickOutside";
import { useMenuPosition } from "@hooks/useMenuPosition";
import { TripsExportMenu } from "./TripsExportMenu";
import type { Trip } from "../../types";

interface ToolbarImportExportProps {
  trips: Trip[];
}

export function ToolbarImportExport({ trips }: ToolbarImportExportProps) {
  const { addTrip } = useTrips();
  const exportBtnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showImportNotice, setShowImportNotice] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  // Import/export logic
  const { fileInputRef, handleFileChange, handleExportCSV, handleExportJSON } =
    useTripIO(trips, addTrip);

  // Close export menu on outside click
  useClickOutside(
    [
      menuRef as React.RefObject<HTMLElement>,
      exportBtnRef as React.RefObject<HTMLElement>,
    ],
    () => setShowExportMenu(false),
    showExportMenu
  );

  // Menu positioning
  const menuStyle = useMenuPosition(
    showExportMenu,
    exportBtnRef,
    menuRef,
    16,
    "right",
    false
  );

  // Trigger file input click
  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  return (
    <>
      <ActionButton
        onClick={() => setShowImportNotice(true)}
        ariaLabel="Import"
        title="Import Trips"
        icon={<FaFileImport />}
        variant="toggle"
      />
      {showImportNotice && (
        <ConfirmModal
          message={
            <>
              Importing will <b>add</b> trips to your current list. Existing
              trips will not be overwritten.
            </>
          }
          onConfirm={() => {
            setShowImportNotice(false);
            setTimeout(triggerFileInput, 0);
          }}
          onCancel={() => setShowImportNotice(false)}
          submitLabel="Continue"
          cancelLabel="Cancel"
          submitIcon={<FaCheck className="inline" />}
        />
      )}
      <input
        type="file"
        accept=".json,.csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div ref={exportBtnRef}>
        <ActionButton
          onClick={() => setShowExportMenu((v) => !v)}
          ariaLabel="Export"
          title="Export Trips"
          icon={<FaFileExport />}
          variant="toggle"
        />
      </div>
      <TripsExportMenu
        open={showExportMenu}
        onClose={() => setShowExportMenu(false)}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        style={menuStyle}
        containerRef={menuRef}
      />
    </>
  );
}
