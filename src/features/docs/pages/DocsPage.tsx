import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarLayout } from "@app/layouts/app/SidebarLayout";
import { MarkdownFileRenderer } from "@components";
import { usePageTitle } from "@hooks";
import { useMarkdownFile } from "@lib/markdown";
import { getDocsMarkdownComponents } from "../components/DocsMarkdownComponents";
import { DocsNotFound } from "../components/DocsNotFound";
import { DocsPanelMenu } from "../components/DocsPanelMenu";
import { WelcomeDocsSection } from "../components/WelcomeSection";
import { DOCS_PATH } from "../constants/docsMenu";
import { getDocBySlug, getSlugFromPath, navigateToDoc } from "../utils/docs";

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
  usePageTitle(doc ? `${doc.label} | Atlaset Docs` : "Atlaset Docs", {
    disableSuffix: true,
    fallback: "Atlaset Docs",
  });

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
