import React from "react";
import { Link } from "react-router-dom";
import { DirectionalIcon } from "../media/icons/DirectionalIcon";

interface SectionLinkProps {
  to: string;
  label: React.ReactNode;
  ariaLabel?: string;
  align?: "left" | "right";
  className?: string;
}

export const SectionLink: React.FC<SectionLinkProps> = ({
  to,
  label,
  ariaLabel,
  align = "left",
  className = "",
}) => {
  const alignmentClass = align === "right" ? "justify-end" : "justify-start";

  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`flex items-center text-xl font-semibold mb-4 gap-2 focus:outline-none hover:underline ${alignmentClass} ${className}`}
    >
      <span>{label}</span>
      <DirectionalIcon direction="next" className="text-base" />
    </Link>
  );
};
