import { useMemo, useState } from "react";
import { Tooltip } from "@components";
import { CountryFlag } from "./CountryFlag";
import type { FlagSize } from "../types";
import { useCountryData } from "../../core/hooks/useCountryData";
import type { Country } from "../../types";
import "./CountryFlagGrid.css";

interface CountryFlagGridProps {
  countryCodes: string[];
  size?: FlagSize;
  gridClassName?: string;
  isHighlighted?: (isoCode: string) => boolean;
  onCountryClick?: (isoCode: string) => void;
}

/** Renders a grid of country flags. */
export function CountryFlagGrid({
  countryCodes,
  size = "32",
  gridClassName,
  isHighlighted,
  onCountryClick,
}: CountryFlagGridProps) {
  const { countryByIsoCode } = useCountryData();

  const [activeTarget, setActiveTarget] = useState<{
    id: string;
    el: HTMLElement;
  } | null>(null);

  const sortedCountries = useMemo(() => {
    return countryCodes
      .map((code) => countryByIsoCode[code])
      .filter((country): country is Country => Boolean(country))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countryCodes, countryByIsoCode]);

  const defaultGridClass =
    size === "64"
      ? "grid grid-cols-2 grid-cols-10 gap-6"
      : "grid w-full gap-2 justify-center justify-items-center items-center mb-2";

  const defaultGridStyle = {
    gridTemplateColumns:
      size === "32" ? "repeat(auto-fit, minmax(36px, max-content))" : undefined,
  };

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
