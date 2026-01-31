import { useMarkdownFile } from "@hooks";
import { MarkdownFileRenderer } from "../shared/components/markdown/MarkdownFileRenderer";
import { changelogMarkdownComponents } from "../features/documentation/components/ChangelogMarkdownComponents";

export default function ChangelogPage() {
  const { content, error } = useMarkdownFile("/CHANGELOG.md");
  const components = changelogMarkdownComponents;

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto p-4 max-w-3xl">
      <title>Changelog | Atlaset</title>
      <h1 className="mb-20 text-3xl font-bold text-center">Changelog</h1>
      <MarkdownFileRenderer
        content={content ? content.split("\n").slice(1).join("\n") : ""}
        error={error}
        components={components}
      />
    </div>
  );
}
