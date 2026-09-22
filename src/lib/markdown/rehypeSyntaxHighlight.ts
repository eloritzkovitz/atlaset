import type { Element, ElementContent, Root, Text } from "hast";
import { refractor } from "refractor/core";
import json from "refractor/json";
import typescript from "refractor/typescript";
import { visit } from "unist-util-visit";

refractor.register(typescript);
refractor.register(json);

const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
};

const SUPPORTED_LANGUAGES = new Set(["typescript", "json"]);

/** A rehype plugin that highlights supported code blocks in markdown content. */
export function rehypeSyntaxHighlight() {
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
      const normalizedLanguage = LANGUAGE_ALIASES[language] ?? language;

      if (!SUPPORTED_LANGUAGES.has(normalizedLanguage)) return;

      const value = node.children
        .filter((child): child is Text => child.type === "text")
        .map((child) => child.value)
        .join("");

      const highlighted = refractor.highlight(value, normalizedLanguage);

      node.children = highlighted.children as ElementContent[];
    });
  };
}
