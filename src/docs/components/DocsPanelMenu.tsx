import { useState, useEffect } from "react";
import {
  Branding,
  DrawerPanel,
  mapMenuItems,
  Separator,
  SidePanelMenu,
  SubmenuSection,
} from "@components";
import { useAccessibility } from "@features/settings/accessibility";
import { useScreenSize } from "@hooks";
import { DOCS_GROUPS } from "../constants/docsMenu";
import React from "react";

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
  const { animationsEnabled } = useAccessibility();
  const { isMobile } = useScreenSize();

  // Track expanded state for each section by key
  const groupEntries = Object.entries(DOCS_GROUPS);
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(groupEntries.map(([key]) => [key, false])),
  );

  // Expand the relevant section if selectedPanel changes
  useEffect(() => {
    if (!selectedPanel) return;
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
    <SidePanelMenu
      title={
        <div className="flex items-center gap-2 px-2">
          <Branding size={36} />
          <span className="font-bold text-2xl">Atlaset Docs</span>
        </div>
      }
      width={340}
      animationsEnabled={animationsEnabled}
      menuItems={[]}
      selectedPanel={selectedPanel || ""}
      setSelectedPanel={setSelectedPanel}
      showSidebar={false}
    >
      <ul>
        {groupEntries.map(([key, group]) => (
          <React.Fragment key={key}>
            <SubmenuSection
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
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </ul>
    </SidePanelMenu>
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
