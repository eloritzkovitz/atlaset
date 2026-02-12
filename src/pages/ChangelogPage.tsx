import { useMarkdownFile, usePageTitle } from "@hooks";
import { MarkdownFileRenderer } from "../shared/components/markdown/MarkdownFileRenderer";
import { changelogMarkdownComponents } from "../features/docs/components/ChangelogMarkdownComponents";

export default function ChangelogPage() {
  const { content, error } = useMarkdownFile("/CHANGELOG.md");
  const components = changelogMarkdownComponents;

  // Set the page title
  usePageTitle("Changelog | Atlaset");

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto p-4 max-w-3xl text-sm sm:text-base">
      <MarkdownFileRenderer
        content={content}
        error={error}
        components={components}
      />
    </div>
  );
}
