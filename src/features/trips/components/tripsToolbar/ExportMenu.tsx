import React from "react";
import { Menu, MenuButton } from "@components";
import { FaFileCsv, FaFileLines } from "react-icons/fa6";

interface ExportMenuProps {
  open: boolean;
  onClose: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  style?: React.CSSProperties;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export function ExportMenu({
  open,
  onClose,
  onExportCSV,
  onExportJSON,
  style,
  containerRef,
}: ExportMenuProps) {
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
        Export as CSV
      </MenuButton>
      <MenuButton
        onClick={() => {
          onExportJSON();
          setTimeout(onClose, 300);
        }}
        icon={<FaFileLines />}
        className="w-full justify-start"
      >
        Export as JSON
      </MenuButton>
    </Menu>
  );
}
