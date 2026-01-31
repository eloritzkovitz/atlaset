import React from "react";
import { getBaseMarkdownComponents } from "@components";
import { hasStringChildren } from "@utils/string";

export const changelogMarkdownComponents = getBaseMarkdownComponents({
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="ml-0 mb-4" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => {
    const { children, ...rest } = props;
    let tag: React.ReactNode = null;
    let text: React.ReactNode[] = children as React.ReactNode[];
    if (Array.isArray(children)) {
      const first = children[0];
      if (
        React.isValidElement(first) &&
        first.type === "strong" &&
        hasStringChildren(first.props)
      ) {
        const strongText = first.props.children.trim();
        const match = strongText.match(/^\[(\w+)\]$/);
        if (match) {
          const badgeText = match[1];
          tag = (
            <span
              className={`changelog-tag changelog-tag-${badgeText.toLowerCase()}`}
            >
              {badgeText}
            </span>
          );
          text = children.slice(1);
        }
      }
    }
    return (
      <li
        className="flex items-start list-none pl-0 py-2"
        style={{ minHeight: "2.25rem" }}
        {...rest}
      >
        {tag && (
          <span className="flex-shrink-0 self-center inline-flex justify-center text-center min-w-[5.5em] mr-2">
            {tag}
          </span>
        )}
        <span className="leading-relaxed">{text}</span>
      </li>
    );
  },
});
