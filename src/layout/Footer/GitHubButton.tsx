import React from "react";
import { FaGithub } from "react-icons/fa6";

interface GitHubButtonProps {
  repoUrl?: string;
  label?: string;
  className?: string;
  iconSize?: number;
}

export const GitHubButton: React.FC<GitHubButtonProps> = ({
  repoUrl = "https://github.com/eloritzkovitz/atlaset",
  label = "atlaset",
  className = "",
  iconSize = 16,
}) => (
  <a
    href={repoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center hover:text-muted/70 ${className}`}
    aria-label="Atlaset GitHub repository"
  >
    <FaGithub className="mr-1" size={iconSize} />
    <span className="hidden sm:inline">{label}</span>
  </a>
);
