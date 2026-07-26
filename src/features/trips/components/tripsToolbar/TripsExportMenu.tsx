import React from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuButton } from "@components";
import { FaFileCsv, FaFileLines } from "react-icons/fa6";

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
  return (
    <Menu
      open={open}
      onClose={onClose}
      className="export-menu !p-2 mt-6"
      style={style}
      containerRef={containerRef}
      disableScroll={true}
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
