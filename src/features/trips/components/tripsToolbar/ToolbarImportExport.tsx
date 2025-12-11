import React, { useRef } from "react";
import { FaFileImport, FaFileExport, FaCheck } from "react-icons/fa6";
import { ActionButton, ConfirmModal } from "@components";
import { useTrips } from "@contexts/TripsContext";
import { useTripIO } from "@features/trips/hooks/useTripsIO";
import { useClickOutside } from "@hooks/useClickOutside";
import type { Trip } from "@types";
import { ExportMenu } from "./ExportMenu";

interface ToolbarImportExportProps {
  trips: Trip[];
};

export function ToolbarImportExport({
  trips,
}: ToolbarImportExportProps) {
  const { addTrip } = useTrips();
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [showImportNotice, setShowImportNotice] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  // Import/export logic
  const {
    fileInputRef,
    handleFileChange,
    handleExportCSV,
    handleExportJSON,
  } = useTripIO(trips, addTrip);

  // Close export menu on outside click
  useClickOutside([exportMenuRef as React.RefObject<HTMLElement>], () =>
    setShowExportMenu(false)
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
      <div className="relative" ref={exportMenuRef}>
        <ActionButton
          onClick={() => setShowExportMenu((v) => !v)}
          ariaLabel="Export"
          title="Export Trips"
          icon={<FaFileExport />}
        />
        {showExportMenu && (
          <ExportMenu
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
          />
        )}
      </div>      
    </>
  );
}
