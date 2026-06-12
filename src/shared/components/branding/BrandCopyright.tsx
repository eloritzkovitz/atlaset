import React from "react";
import { Branding } from "./Branding";

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
  textClassName = "ms-1 align-middle",
  logoSize = 32,
  showLogo = false,
}) => (
  <span dir="ltr" className={className}>
    {showLogo && (
      <span className={`w-8 h-8 inline-block align-middle`}>
        <Branding size={logoSize} />
      </span>
    )}
    <span className={textClassName}>Atlaset © {year}</span>
  </span>
);
