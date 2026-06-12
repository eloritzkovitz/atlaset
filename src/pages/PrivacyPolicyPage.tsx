import { MarkdownFileRenderer } from "@components";
import { getDocsMarkdownComponents } from "@features/docs";
import { useMarkdownFile, usePageTitle } from "@hooks";

export default function PrivacyPolicyPage() {
  const { content, error } = useMarkdownFile("/privacy.md");
  const components = getDocsMarkdownComponents();

  usePageTitle("Privacy Policy | Atlaset");

  return (
    <div
      dir="ltr"
      className="prose dark:prose-invert mx-auto p-4 max-w-3xl text-sm sm:text-base"
    >
      <h1 className="text-5xl sm:text-6xl md:text-7xl text-center font-bold leading-tight mb-8">
        Privacy Policy
      </h1>
      <MarkdownFileRenderer
        content={content}
        error={error}
        components={components}
      />
    </div>
  );
}
