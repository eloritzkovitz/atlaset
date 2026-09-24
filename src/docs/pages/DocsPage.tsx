import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarLayout } from "@app/layouts/app/SidebarLayout";
import { Breadcrumbs, Container, MarkdownFileRenderer } from "@components";
import { usePageTitle } from "@hooks";
import { useMarkdownFile } from "@lib/markdown";
import { DocsHeader } from "../components/DocsHeader";
import { DocsNotFound } from "../components/DocsNotFound";
import { DocsPanelMenu } from "../components/DocsPanelMenu";
import { WelcomeDocsSection } from "../components/WelcomeSection";
import { DOCS_PATH } from "../constants/docsMenu";
import { getDocsMarkdownComponents } from "../markdown/getDocsMarkdownComponents";
import { getDocBySlug, getSlugFromPath } from "../utils/docs";
import {
  getDocsBreadcrumbs,
  navigateToDoc,
  navigateToDocs,
  navigateToDocsGroup,
} from "../utils/docsNavigation";

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

  const breadcrumbs = useMemo(
    () => (doc ? getDocsBreadcrumbs(doc.file) : []),
    [doc],
  );

  const handleCrumbClick = (key: string) => {
    if (key === "docs") {
      navigateToDocs(navigate);
      return;
    }

    navigateToDocsGroup(navigate, key);
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <DocsHeader show={true} />

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <SidebarLayout
          menu={
            !(slug && !doc) ? (
              <DocsPanelMenu
                selectedPanel={slug ? (doc ? doc.file : undefined) : undefined}
                setSelectedPanel={(file: string) =>
                  navigateToDoc(navigate, file)
                }
              />
            ) : undefined
          }
          className="!h-full"
        >
          <Container>
            {doc ? (
              <div className="mx-auto w-full !w-4xl">
                <Breadcrumbs
                  crumbs={breadcrumbs}
                  onCrumbClick={handleCrumbClick}
                />

                <MarkdownFileRenderer
                  content={content}
                  error={error}
                  components={getDocsMarkdownComponents((file) =>
                    navigateToDoc(navigate, file),
                  )}
                />
              </div>
            ) : slug ? (
              <DocsNotFound />
            ) : (
              <WelcomeDocsSection />
            )}
          </Container>
        </SidebarLayout>
      </div>
    </div>
  );
}
