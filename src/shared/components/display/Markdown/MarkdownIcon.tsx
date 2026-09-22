import React from "react";
import { ICONS } from "@constants/icons";

interface MarkdownIconProps {
  name?: string;
  className?: string;
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

/** Renders an Atlaset icon referenced by a dot-separated icon name. */
export function MarkdownIcon({ name, className }: MarkdownIconProps) {
  if (!name) return null;

  const icon = name.split(".").reduce<unknown>((value, key) => {
    if (typeof value !== "object" || value === null) {
      return undefined;
    }

    return key in value ? (value as Record<string, unknown>)[key] : undefined;
  }, ICONS);

  if (typeof icon !== "function") {
    return null;
  }

  const Icon = icon as IconComponent;

  return (
    <Icon
      className={`inline-block h-4 w-4 align-middle ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
