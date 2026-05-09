import React, { useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import { ActionButton, ConfirmModal } from "@components";
import { ICONS } from "@constants/icons";
import { useTrips } from "@contexts/TripsContext";
import { useClickOutside, useMenuPosition } from "@hooks";
import { TripsExportMenu } from "./TripsExportMenu";
import { useTripIO } from "../../hooks/useTripsIO";
import type { Trip } from "../../types";

interface ToolbarImportExportProps {
  trips: Trip[];
}

export function ToolbarImportExport({ trips }: ToolbarImportExportProps) {
  const { t } = useTranslation("trips");
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
    showExportMenu,
  );

  // Menu positioning
  const menuStyle = useMenuPosition(
    showExportMenu,
    exportBtnRef,
    menuRef,
    16,
    "right",
    "adjacent",
    false,
  );

  // Trigger file input click
  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  return (
    <>
      <ActionButton
        onClick={() => setShowImportNotice(true)}
        ariaLabel={t("table.toolbar.importExport.importTitle")}
        title={t("table.toolbar.importExport.importTitle")}
        icon={<ICONS.importFile />}
        variant="toggle"
      />
      {showImportNotice && (
        <ConfirmModal
          title={t("table.toolbar.importExport.importConfirmTitle")}
          message={
            <Trans i18nKey="table.toolbar.importExport.importConfirmMessage" ns="trips">
              Importing will <b>add</b> trips to your current list. Existing
              trips will not be overwritten.
            </Trans>
          }
          onConfirm={() => {
            setShowImportNotice(false);
            setTimeout(triggerFileInput, 0);
          }}
          onCancel={() => setShowImportNotice(false)}
          submitLabel={t("table.toolbar.importExport.continue")}
          cancelLabel={t("table.toolbar.importExport.cancel")}
          submitIcon={<ICONS.selected className="inline" />}
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
          ariaLabel={t("table.toolbar.importExport.exportTitle")}
          title={t("table.toolbar.importExport.exportTitle")}
          icon={<ICONS.exportFile />}
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
