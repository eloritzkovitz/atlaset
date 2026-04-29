import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MarkdownFileRenderer } from "@components";
import { SidebarLayout } from "@layouts";
import {
  DOCS_PATH,
  DocsPanelMenu,
  getDocBySlug,
  getDocsMarkdownComponents,
  navigateToDoc,
  WelcomeDocsSection,
} from "@features/docs";
import { useMarkdownFile, usePageTitle } from "@hooks";

export default function DocsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract slug from URL
  const slug = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return undefined;
    if (parts[0] !== "docs") return undefined;
    return parts.length > 1 ? parts[parts.length - 1] : undefined;
  }, [location.pathname]);

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
    <SidebarLayout
      menu={
        <DocsPanelMenu
          selectedPanel={slug ? (doc ? doc.file : undefined) : undefined}
          setSelectedPanel={(file: string) => navigateToDoc(navigate, file)}
        />
      }
    >
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
    </SidebarLayout>
  );
}
