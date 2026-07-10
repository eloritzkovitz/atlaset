import { MenuButton } from "@components";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import type { Country } from "../../types";

export type CountryListRowTone = "visited" | "dimmed-colored" | "dimmed-gray";

interface CountryListRowProps {
  country: Country;
  tone?: CountryListRowTone;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onContextMenu?: (event: React.MouseEvent, country: Country) => void;
  showBadges?: boolean;
  renderBadge?: (country: Country) => React.ReactNode;
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
          <CountryWithFlag
            isoCode={country.isoCode}
            name={country.name}
            visited={isFlagVisited}
          />
        </span>
        {showBadges && renderBadge && renderBadge(country)}
      </MenuButton>
    </div>
  );
}
