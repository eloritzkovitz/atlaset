import { MarkdownFileRenderer } from "@components";
import { changelogMarkdownComponents } from "@features/docs";
import { usePageTitle } from "@hooks";
import { useMarkdownFile } from "@lib/markdown";

export default function ChangelogPage() {
  const { content, error } = useMarkdownFile("/CHANGELOG.md");
  const components = changelogMarkdownComponents;

  usePageTitle("Changelog");

  return (
    <div
      dir="ltr"
      className="prose prose-slate dark:prose-invert mx-auto p-4 max-w-3xl text-sm sm:text-base"
    >
      <MarkdownFileRenderer
        content={content}
        error={error}
        components={components}
      />
    </div>
  );
}
