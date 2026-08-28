import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, DirectionalIcon } from "@components";
import { CountryDisplay } from "@features/countries";
import type { Country } from "@features/countries/types";
import { getCountriesRoute } from "../../core/utils/exploreNavigation";

interface DiscoverCountryCardProps {
  title: string;
  actions?: ReactNode;
  country?: Country;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}

/** Displays a country as a Discover card. */
export function DiscoverCountryCard({
  title,
  actions,
  country,
  loading = false,
  children,
  className = "",
}: DiscoverCountryCardProps) {
  const { t } = useTranslation("explore");

  if (!country && !loading && !children) return null;

  const route = country
    ? getCountriesRoute(country.region, country.subregion, country.isoCode)
    : undefined;

  return (
    <Card
      title={title}
      actions={actions}
      loading={loading}
      skeletonLines={4}
      className={`p-6 hover:bg-primary/20 hover:scale-101 transition-transform duration-200 ${className}`}
    >
      {!loading && (
        <div className="flex flex-col items-center text-center mt-6">
          {country && route && (
            <Link
              to={route}
              className="group flex w-full flex-col items-center text-center"
              aria-label={t("discover.country.open", "Explore {{country}}", {
                country: country.name,
              })}
            >
              <CountryDisplay country={country} flagSize="128" />

              <div className="mt-5 flex items-center justify-center gap-2 font-medium">
                <span>
                  {t("discover.country.open", "Explore {{country}}", {
                    country: country.name,
                  })}
                </span>

                <DirectionalIcon
                  direction="next"
                  variant="arrow"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </Link>
          )}

          {children}
        </div>
      )}
    </Card>
  );
}
