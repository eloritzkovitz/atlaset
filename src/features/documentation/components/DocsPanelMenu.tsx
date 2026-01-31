import { DrawerPanel, MenuButton, Panel, SectionHeader } from "@components";
import { useIsMobile } from "@hooks";
import { Branding } from "@layout";
import { DEV_DOCS, DOCS } from "../config/docs";

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

  // Panel content
  const panelContent = (
    <Panel
      title={
        <div className="flex items-center gap-2 px-2">
          <Branding size={36} />
          <span className="font-bold text-2xl">Atlaset</span>
        </div>
      }
      width={280}
      className="!left-0"
      onHide={onClose}
    >
      <ul>
        <li>
          <SectionHeader className="mb-2">Using Atlaset</SectionHeader>
        </li>
        {DOCS.map((doc) => (
          <li key={doc.file}>
            <MenuButton
              icon={doc.icon}
              active={selectedPanel === doc.file}
              onClick={() => {
                setSelectedPanel(doc.file);
                if (isMobile && onClose) onClose();
              }}
              className="w-full mb-2"
            >
              {doc.label}
            </MenuButton>
          </li>
        ))}
        {DEV_DOCS && DEV_DOCS.length > 0 && (
          <>
            <li>
              <SectionHeader className="mt-4 mb-2">
                For Developers
              </SectionHeader>
            </li>
            {DEV_DOCS.map((doc) => (
              <li key={doc.file}>
                <MenuButton
                  icon={doc.icon}
                  active={selectedPanel === doc.file}
                  onClick={() => {
                    setSelectedPanel(doc.file);
                    if (isMobile && onClose) onClose();
                  }}
                  className="w-full mb-2"
                >
                  {doc.label}
                </MenuButton>
              </li>
            ))}
          </>
        )}
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
