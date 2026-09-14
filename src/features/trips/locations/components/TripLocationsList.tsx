import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner, SectionHeader } from "@components";
import { CountryWithFlag, SPECIAL_COUNTRIES } from "@features/countries";
import { useLanguage } from "@features/settings/account";
import type { Location } from "@lib/locations";
import { TripLocationItem } from "./TripLocationItem";

interface TripLocationsListProps {
  locations: Location[];
  loading?: boolean;
  selectedLocationId?: number;
  onLocationClick?: (location: Location) => void;
  onRemove?: (locationId: number) => void;
}

export function TripLocationsList({
  locations,
  loading = false,
  selectedLocationId,
  onLocationClick,
  onRemove,
}: TripLocationsListProps) {
  const { t } = useTranslation("trips");
  const { current: lang } = useLanguage();

  const groupedLocations = useMemo(() => {
    const countries = new Map<
      string,
      {
        name: string;
        locationsByAdmin1: Map<string, Location[]>;
        locationsWithoutAdmin1: Location[];
      }
    >();

    for (const location of locations) {
      let country = countries.get(location.countryCode);

      if (!country) {
        country = {
          name: location.countryName,
          locationsByAdmin1: new Map(),
          locationsWithoutAdmin1: [],
        };

        countries.set(location.countryCode, country);
      }

      if (location.admin1) {
        const admin1Key = location.admin1.code;

        if (!country.locationsByAdmin1.has(admin1Key)) {
          country.locationsByAdmin1.set(admin1Key, []);
        }

        country.locationsByAdmin1.get(admin1Key)!.push(location);
      } else {
        country.locationsWithoutAdmin1.push(location);
      }
    }

    return countries;
  }, [locations]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (locations.length === 0) {
    return (
      <p className="text-sm text-muted">
        {t("editor.destinations.locations.none")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {[...groupedLocations.entries()]
        .sort(([, a], [, b]) => a.name.localeCompare(b.name))
        .map(([countryCode, country]) => (
          <div key={countryCode}>
            <CountryWithFlag
              country={{
                isoCode: countryCode,
                name: country.name,
              }}
            />

            <div className="ms-4">
              {[...country.locationsByAdmin1.entries()]
                .sort(([, a], [, b]) =>
                  (a[0].admin1?.name ?? "").localeCompare(
                    b[0].admin1?.name ?? "",
                  ),
                )
                .map(([admin1Code, admin1Locations]) => {
                  const admin1 = admin1Locations[0].admin1!;
                  const admin1IsoCode =
                    `${countryCode}-${admin1.code}`.toUpperCase();

                  const hasFlag = Boolean(
                    SPECIAL_COUNTRIES[admin1IsoCode]?.flag,
                  );

                  return (
                    <div key={admin1Code}>
                      {hasFlag ? (
                        <SectionHeader
                          title={
                            <span className="flex items-center gap-2">
                              <CountryWithFlag
                                country={{
                                  isoCode: admin1IsoCode,
                                  name: admin1.name,
                                }}
                              />
                            </span>
                          }
                        />
                      ) : (
                        <SectionHeader title={admin1.name} />
                      )}

                      <div className="ms-3 flex flex-col gap-1">
                        {[...admin1Locations]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((location) => (
                            <TripLocationItem
                              key={location.id}
                              location={location}
                              lang={lang}
                              selected={location.id === selectedLocationId}
                              onClick={onLocationClick}
                              onRemove={onRemove}
                            />
                          ))}
                      </div>
                    </div>
                  );
                })}

              {[...country.locationsWithoutAdmin1]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((location) => (
                  <TripLocationItem
                    key={location.id}
                    location={location}
                    lang={lang}
                    selected={location.id === selectedLocationId}
                    onClick={onLocationClick}
                    onRemove={onRemove}
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
