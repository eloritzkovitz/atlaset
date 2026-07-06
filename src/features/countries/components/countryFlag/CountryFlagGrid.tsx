import { useMemo, useState } from "react";
import { Tooltip } from "@components";
import { CountryFlag } from "./CountryFlag";
import { useCountryData } from "../../hooks/useCountryData";
import type { FlagSize } from "../../types/flag";
import "./CountryFlagGrid.css";

interface CountryFlagGridProps {
  countryCodes: string[];
  size?: FlagSize;
  gridClassName?: string;
  isHighlighted?: (isoCode: string) => boolean;
  onCountryClick?: (isoCode: string) => void;
}

export function CountryFlagGrid({
  countryCodes,
  size = "32",
  gridClassName,
  isHighlighted,
  onCountryClick,
}: CountryFlagGridProps) {
  const { countries } = useCountryData();

  const [activeTarget, setActiveTarget] = useState<{
    id: string;
    el: HTMLElement;
  } | null>(null);

  const sortedCountries = useMemo(() => {
    const codeSet = new Set(countryCodes);
    return countries
      .filter((c) => codeSet.has(c.isoCode))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, countryCodes]);

  const defaultGridClass =
    size === "64"
      ? "grid grid-cols-2 md:grid-cols-10 gap-6"
      : "grid gap-2 justify-items-center items-center max-w-xs mx-auto mb-2";

  const defaultGridStyle =
    size === "32"
      ? { gridTemplateColumns: `repeat(auto-fit, minmax(36px, 1fr))` }
      : undefined;

  return (
    <ul
      className={gridClassName || defaultGridClass}
      style={gridClassName ? undefined : defaultGridStyle}
    >
      {sortedCountries.map((country) => {
        const active = isHighlighted ? isHighlighted(country.isoCode) : true;
        const Component = onCountryClick ? "button" : "span";
        const isHovered = activeTarget?.id === country.isoCode;

        return (
          <li
            key={country.isoCode}
            className="flex items-center justify-center"
          >
            <Component
              type={onCountryClick ? "button" : undefined}
              onClick={
                onCountryClick
                  ? () => onCountryClick(country.isoCode)
                  : undefined
              }
              onMouseEnter={(e) =>
                setActiveTarget({ id: country.isoCode, el: e.currentTarget })
              }
              onMouseLeave={() => setActiveTarget(null)}
              style={{ opacity: active ? 1 : 0.4 }}
              className={`flex justify-center items-center transition-all duration-200 ${
                active ? "" : "flag-grayscale-hover"
              } ${size === "64" ? "w-18 h-12" : "w-9 h-7"} ${
                onCountryClick
                  ? "cursor-pointer hover:scale-110 active:scale-95"
                  : "cursor-default"
              }`}
            >
              <CountryFlag
                flag={{
                  isoCode: country.isoCode,
                  sovereignState: country.sovereignState,
                  ratio: "3x2",
                  size: size,
                }}
              />
            </Component>

            {isHovered && (
              <Tooltip
                content={country.name}
                position="bottom"
                target={activeTarget.el}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
