import type { ReactNode } from "react";
import {
  ActionButton,
  DirectionalIcon,
  HeaderNavigation,
  type HeaderNavigationProps,
} from "@components";
import { useScreenSize } from "@hooks";

interface ExploreHeaderProps extends HeaderNavigationProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  actions?: ReactNode;
  onBack?: () => void;
}

export function ExploreHeader({
  title,
  subtitle,
  leading,
  actions,
  onBack,
  previous,
  next,
}: ExploreHeaderProps) {
  const { isMobile } = useScreenSize();

  return (
    <div className="mb-4">
      {(previous || next) && (
        <HeaderNavigation previous={previous} next={next} />
      )}

      <div className="flex items-center gap-4">
        {onBack && (
          <ActionButton
            variant="custom"
            onClick={onBack}
            ariaLabel="Back"
            className="p-0"
            icon={
              <DirectionalIcon
                direction="prev"
                variant="chevron"
                className="text-xl"
              />
            }
          />
        )}

        {leading && <div className="flex items-center">{leading}</div>}

        <div className="flex min-w-0 items-baseline gap-2">
          <h1
            className={
              isMobile ? "!text-2xl font-bold" : "!text-4xl font-bold mb-4"
            }
          >
            {title}
          </h1>

          {subtitle && (
            <span
              className={
                isMobile ? "text-sm text-muted" : "text-2xl text-muted mb-2"
              }
            >
              {subtitle}
            </span>
          )}
        </div>

        {actions && <div className="flex items-center">{actions}</div>}
      </div>
    </div>
  );
}
