import React from "react";
import { useTranslation } from "react-i18next";
import { FaFileCsv, FaFileLines } from "react-icons/fa6";
import { Menu, MenuButton } from "@components";

interface TripsExportMenuProps {
  open: boolean;
  onClose: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  style?: React.CSSProperties;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function TripsExportMenu({
  open,
  onClose,
  onExportCSV,
  onExportJSON,
  style,
  containerRef,
}: TripsExportMenuProps) {
  const { t } = useTranslation("trips");

  if (!open) return null;

  return (
    <Menu
      open={open}
      className="export-menu !p-2 mt-6"
      style={style}
      containerRef={containerRef}
      disableScroll
    >
      <MenuButton
        onClick={() => {
          onExportCSV();
          setTimeout(onClose, 300);
        }}
        icon={<FaFileCsv />}
        className="w-full justify-start"
      >
        {t("table.toolbar.importExport.exportCSV")}
      </MenuButton>

      <MenuButton
        onClick={() => {
          onExportJSON();
          setTimeout(onClose, 300);
        }}
        icon={<FaFileLines />}
        className="w-full justify-start"
      >
        {t("table.toolbar.importExport.exportJSON")}
      </MenuButton>
    </Menu>
  );
}
