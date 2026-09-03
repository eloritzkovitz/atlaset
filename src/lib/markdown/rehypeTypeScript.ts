import type { Element, ElementContent, Root, Text } from "hast";
import { refractor } from "refractor/core";
import typescript from "refractor/typescript";
import { visit } from "unist-util-visit";

refractor.register(typescript);

/** A rehype plugin that highlights TypeScript code blocks in markdown content. */
export function rehypeTypeScript() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "code") return;

      const className = node.properties.className;

      if (!Array.isArray(className)) return;

      const languageClass = className.find(
        (value): value is string =>
          typeof value === "string" && value.startsWith("language-"),
      );

      if (!languageClass) return;

      const language = languageClass.slice("language-".length);

      if (language !== "typescript" && language !== "ts") return;

      const value = node.children
        .filter((child): child is Text => child.type === "text")
        .map((child) => child.value)
        .join("");

      const highlighted = refractor.highlight(value, "typescript");

      node.children = highlighted.children as ElementContent[];
    });
  };
}
