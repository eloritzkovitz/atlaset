import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HamburgerButton, MarkdownFileRenderer } from "@components";
import {
  DOCS_PATH,
  DocsPanelMenu,
  getDocBySlug,
  getDocsMarkdownComponents,
  navigateToDoc,
  WelcomeDocsSection,
} from "@features/documentation";
import { useIsMobile, useMarkdownFile, usePageTitle } from "@hooks";

export default function DocsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [panelOpen, setPanelOpen] = useState(false);

  // Only get doc if slug is present
  const doc = useMemo(() => (slug ? getDocBySlug(slug) : null), [slug]);
  const { content, error } = useMarkdownFile(
    doc ? DOCS_PATH + doc.file : undefined,
  );

  // Set page titles dynamically
  usePageTitle(
    doc ? doc.label : "Atlaset Docs",
    doc
      ? {
          suffix: " | Atlaset Docs",
          fallback: "Atlaset Docs",
        }
      : { suffix: "", fallback: "Atlaset Docs" },
  );

  return (
    <div className="relative h-screen w-screen bg-bg overflow-x-hidden">
      {isMobile && <HamburgerButton onClick={() => setPanelOpen(true)} />}
      <div className="flex flex-row h-full w-full max-w-4xl mx-auto gap-6">
        <div className="flex-shrink-0 flex flex-col justify-start h-full">
          <DocsPanelMenu
            selectedPanel={slug ? (doc ? doc.file : undefined) : undefined}
            setSelectedPanel={(file: string) => navigateToDoc(navigate, file)}
            open={isMobile ? panelOpen : undefined}
            onClose={isMobile ? () => setPanelOpen(false) : undefined}
          />
        </div>
        <main className="flex-1 flex flex-col items-center px-2 md:px-12 py-10 md:py-16 min-h-screen">
          <div className="w-full max-w-2xl">
            {doc ? (
              <MarkdownFileRenderer
                content={content}
                error={error}
                components={getDocsMarkdownComponents((file) =>
                  navigateToDoc(navigate, file),
                )}
              />
            ) : (
              <WelcomeDocsSection />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
