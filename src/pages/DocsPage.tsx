import { useState } from "react";
import { HamburgerButton, MarkdownFileRenderer } from "@components";
import {
  DOCS,
  DOCS_PATH,
  DocsPanelMenu,
  getDocsMarkdownComponents,
} from "@features/documentation";
import { useIsMobile, useMarkdownFile } from "@hooks";

export default function DocsPage() {
  const [selectedPanel, setSelectedPanel] = useState(DOCS[0].file);
  const [panelOpen, setPanelOpen] = useState(false);
  const isMobile = useIsMobile();

  // Load selected doc content
  const { content, error } = useMarkdownFile(DOCS_PATH + selectedPanel);

  return (
    <div className="relative h-screen w-screen bg-bg overflow-x-hidden">
      <title>Documentation | Atlaset</title>
      {/* Hamburger for mobile */}
      {isMobile && <HamburgerButton onClick={() => setPanelOpen(true)} />}
      <div className="flex flex-row h-full w-full max-w-4xl mx-auto gap-6">
        {/* Sidebar menu at left edge */}
        <div className="flex-shrink-0 flex flex-col justify-start h-full">
          <DocsPanelMenu
            selectedPanel={selectedPanel}
            setSelectedPanel={setSelectedPanel}
            open={isMobile ? panelOpen : undefined}
            onClose={isMobile ? () => setPanelOpen(false) : undefined}
          />
        </div>
        <main className="flex-1 flex flex-col items-center px-2 md:px-12 py-10 md:py-16 min-h-screen">
          <div className="w-full max-w-2xl">
            <MarkdownFileRenderer
              content={content}
              error={error}
              components={getDocsMarkdownComponents(setSelectedPanel)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
