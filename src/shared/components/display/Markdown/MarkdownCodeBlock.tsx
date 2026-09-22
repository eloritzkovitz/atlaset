import React, { useState } from "react";
import { ICONS } from "@constants/icons";
import { ActionButton } from "../../inputs/Button/ActionButton";

interface MarkdownCodeBlockProps {
  children?: React.ReactNode;
}

/**
 * Extracts the text content from a React node.
 * @param node - The React node to extract text from.
 * @returns The extracted text.
 */
function getCodeText(node: React.ReactNode): string {
  if (typeof node === "string") return node;

  if (Array.isArray(node)) {
    return node.map(getCodeText).join("");
  }

  if (!React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return "";
  }

  return getCodeText(node.props.children);
}

/** Renders a code block with a copy button. */
export function MarkdownCodeBlock({ children }: MarkdownCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = getCodeText(children);

    await navigator.clipboard.writeText(code);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg bg-code-block">
      <ActionButton
        icon={copied ? <ICONS.check /> : <ICONS.copyLink />}
        ariaLabel={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy code"}
        variant="custom"
        className="absolute end-2 top-2 z-10 h-8 w-8 text-muted opacity-0 transition-opacity hover:text-action-text-hover group-hover:opacity-100 focus-visible:opacity-100"
        onClick={handleCopy}
      />

      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        {children}
      </pre>
    </div>
  );
}
