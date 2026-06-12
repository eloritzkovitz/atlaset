import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MarkdownFileRenderer } from "@components";
import {
  DOCS_PATH,
  DocsNotFound,
  DocsPanelMenu,
  getDocBySlug,
  getDocsMarkdownComponents,
  getSlugFromPath,
  navigateToDoc,
  WelcomeDocsSection,
} from "@features/docs";
import { useMarkdownFile, usePageTitle } from "@hooks";
import { SidebarLayout } from "@layouts";

export default function DocsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract slug from URL
  const slug = useMemo(
    () => getSlugFromPath(location.pathname),
    [location.pathname],
  );

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
    <div dir="ltr">
      <SidebarLayout
        menu={
          !(slug && !doc) ? (
            <DocsPanelMenu
              selectedPanel={slug ? (doc ? doc.file : undefined) : undefined}
              setSelectedPanel={(file: string) => navigateToDoc(navigate, file)}
            />
          ) : undefined
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
          ) : slug ? (
            <DocsNotFound />
          ) : (
            <WelcomeDocsSection />
          )}
        </div>
      </SidebarLayout>
    </div>
  );
}
