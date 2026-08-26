import React from "react";
import { DirectionalIcon } from "@components";
import { useScreenSize } from "@hooks";

interface ExploreHeaderProps {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export function ExploreHeader({
  title,
  subtitle,
  leading,
  actions,
  onBack,
}: ExploreHeaderProps) {
  const { isMobile } = useScreenSize();
  return (
    <span className="flex items-center gap-4 mb-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:text-muted"
        >
          <DirectionalIcon
            direction="prev"
            variant="arrow"
            className="text-xl"
          />
        </button>
      )}
      {leading && <span className="flex items-center">{leading}</span>}
      <h1 className={`!text-${isMobile ? "2xl" : "4xl mb-4"} font-bold`}>
        {title}
      </h1>
      {subtitle && (
        <span className={`text-${isMobile ? "sm" : "2xl mb-2"} text-muted`}>
          {subtitle}
        </span>
      )}
      {actions && <span className="flex items-center">{actions}</span>}
    </span>
  );
}
