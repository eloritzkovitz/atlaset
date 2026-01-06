import { Branding } from "./Branding";
import React from "react";

interface BrandCopyrightProps {
  year?: number;
  className?: string;
  textClassName?: string;
  showLogo?: boolean;
  logoSize?: number;
}

export const BrandCopyright: React.FC<BrandCopyrightProps> = ({
  year = new Date().getFullYear(),
  className = "inline-flex items-center",
  textClassName = "ml-1 align-middle",
  logoSize = 20,
  showLogo = false,
}) => (
  <span className={className}>
    {showLogo && (
      <span className={`w-5 h-5 inline-block align-middle`}>
        <Branding size={logoSize} />
      </span>
    )}
    <span className={textClassName}>Atlaset © {year}</span>
  </span>
);
