import { MenuButton } from "@components";
import type { CountryBadgeProps } from "../types";
import { CountryWithFlag } from "../../flags/components/CountryWithFlag";
import type { Country, CountryContextMenuProps } from "../../types";

export type CountryListRowTone = "visited" | "dimmed-colored" | "dimmed-gray";

interface CountryListRowProps
  extends CountryContextMenuProps, CountryBadgeProps {
  country: Country;
  tone?: CountryListRowTone;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function CountryListRow({
  country,
  tone = "visited",
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  showBadges,
  renderBadge,
}: CountryListRowProps) {
  const isDimmed = tone !== "visited";
  const isFlagVisited = tone !== "dimmed-gray";

  return (
    <div
      onContextMenu={(event) => onContextMenu?.(event, country)}
      className="w-full"
    >
      <MenuButton
        icon={undefined}
        onClick={onClick}
        className={`w-full ${className}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span
          style={{ opacity: isDimmed ? 0.4 : 1 }}
          className={tone === "dimmed-gray" ? "flag-grayscale-hover" : ""}
        >
          <CountryWithFlag country={country} visited={isFlagVisited} />
        </span>
        {showBadges && renderBadge && renderBadge(country)}
      </MenuButton>
    </div>
  );
}
