import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  Branding,
  DrawerPanel,
  mapMenuItems,
  MenuButton,
  Panel,
  SubmenuSection,
} from "@components";
import { useScreenSize } from "@hooks";
import { DOCS_GROUPS } from "../constants/docsMenu";

interface DocsPanelMenuProps {
  selectedPanel?: string;
  setSelectedPanel: (panel: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export function DocsPanelMenu({
  selectedPanel,
  setSelectedPanel,
  open,
  onClose,
}: DocsPanelMenuProps) {
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();

  // Track expanded state for each section by key
  const groupEntries = Object.entries(DOCS_GROUPS);
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(groupEntries.map(([key]) => [key, false])),
  );

  // Expand the relevant section if selectedPanel changes
  useEffect(() => {
    if (!selectedPanel) return;
    // Find which group contains the selectedPanel (by file)
    const found = groupEntries.find(([, group]) =>
      group.items.some((doc) => doc.file === selectedPanel),
    );
    if (found) {
      const [foundKey] = found;
      setExpanded((prev) => ({ ...prev, [foundKey]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPanel]);

  // Panel content
  const panelContent = (
    <Panel
      title={
        <div className="flex items-center gap-2 px-2">
          <Branding size={36} />
          <span className="font-bold text-2xl">Atlaset Docs</span>
        </div>
      }
      width={340}
      className="!start-0"
      onHide={onClose}
    >
      {selectedPanel && (
        <div className="flex justify-center mb-2 mt-2">
          <MenuButton
            icon={<FaChevronLeft />}
            className="w-full"
            onClick={() => navigate("/docs")}
            ariaLabel="Return to docs home"
          >
            Return to Home
          </MenuButton>
        </div>
      )}
      <ul className="mt-2">
        {groupEntries.map(([key, group]) => (
          <SubmenuSection
            key={key}
            icon={group.header.icon ? <group.header.icon /> : null}
            label={group.header.label}
            expanded={expanded[key]}
            onToggle={() =>
              setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            submenu={mapMenuItems(
              group.items.map((item) => ({ ...item, key: item.file })),
            )}
            selectedPanel={selectedPanel}
            setSelectedPanel={(panelFile) => {
              setSelectedPanel(panelFile);
              if (isMobile && onClose) onClose();
            }}
          />
        ))}
      </ul>
    </Panel>
  );

  // Mobile: drawer
  if (isMobile) {
    return (
      <DrawerPanel open={!!open} onClose={onClose!} width={256}>
        {panelContent}
      </DrawerPanel>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
