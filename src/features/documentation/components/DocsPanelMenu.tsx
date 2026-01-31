import { useState } from "react";
import { DrawerPanel, Panel, SubmenuSection } from "@components";
import { useIsMobile } from "@hooks";
import { Branding } from "@layout";
import { DOCS_GROUPS } from "../config/docs";

interface DocsPanelMenuProps {
  selectedPanel: string;
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
  const isMobile = useIsMobile();
  // Track expanded state for each section by key
  const groupEntries = Object.entries(DOCS_GROUPS);
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(groupEntries.map(([key]) => [key, false])),
  );

  // Panel content
  const panelContent = (
    <Panel
      title={
        <div className="flex items-center gap-2 px-2">
          <Branding size={36} />
          <span className="font-bold text-2xl">Atlaset Docs</span>
        </div>
      }
      width={320}
      className="!left-0"
      onHide={onClose}
    >
      <ul className="mt-2">
        {groupEntries.map(([key, group]) => (
          <SubmenuSection
            key={key}
            icon={group.header.icon}
            label={group.header.label}
            expanded={expanded[key]}
            onToggle={() =>
              setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            submenu={group.items
              .filter((doc) => doc.file)
              .map((doc) => ({
                key: doc.file,
                label: doc.label,
                icon: doc.icon,
              }))}
            selectedPanel={selectedPanel}
            setSelectedPanel={(panelKey) => {
              setSelectedPanel(panelKey);
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
