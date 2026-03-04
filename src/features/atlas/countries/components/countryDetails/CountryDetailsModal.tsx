import { useState, useRef, useEffect } from "react";
import { FaWikipediaW } from "react-icons/fa6";
import { ActionButton, Modal, PanelHeader } from "@components";
import { ICONS } from "@constants/icons";
import {
  CountryDetailsContent,
  CountryWithFlag,
  useCountryData,
  type Country,
} from "@features/countries";
import { VisitedStatusIndicator } from "@features/countries/components/countryDetails/VisitedStatusIndicator";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { useKeyHandler } from "@hooks";
import { CountryVisitsDrawer } from "./CountryVisitsDrawer";
import { useMapView } from "@contexts/MapViewContext";

interface CountryDetailsModalProps {
  isOpen: boolean;
  country: Country | null;
  onClose: () => void;
}

export function CountryDetailsModal({
  isOpen,
  country,
  onClose,
}: CountryDetailsModalProps) {
  const { currencies } = useCountryData();
  const { isCountryVisited, getCountryVisitsCategorized } =
    useVisitedCountries();
  const isVisited = country ? isCountryVisited(country.isoCode) : false;
  const categorizedVisits = country
    ? getCountryVisitsCategorized(country.isoCode)
    : { past: [], upcoming: [], tentative: [] };
  const [showVisitsDrawer, setShowVisitsDrawer] = useState(false);
  const { centerOnCountry } = useMapView();

  // Get home country from settings
  const { homeCountry } = useHomeCountry();

  // For positioning the drawer and chevron
  const modalRef = useRef<HTMLDivElement>(null);
  const openChevronRef = useRef<HTMLButtonElement>(null);
  const closeChevronRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Auto-close drawer when modal closes
  useEffect(() => {
    if (!isOpen) setShowVisitsDrawer(false);
  }, [isOpen]);

  // Center map handler
  useKeyHandler(
    (e) => {
      e.preventDefault();
      centerOnCountry(country?.isoCode || "");
    },
    ["x", "X"],
    isOpen,
  );

  // Do not render if no country is selected
  if (!country) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      {/* Visits Drawer */}
      {showVisitsDrawer && (
        <CountryVisitsDrawer
          open={showVisitsDrawer}
          onClose={() => setShowVisitsDrawer(false)}
          visits={categorizedVisits}
          targetRef={modalRef}
          chevronRef={closeChevronRef}
        />
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl md:w-[540px] p-4 sm:p-8 shadow-lg relative"
        containerRef={modalRef}
        extraRefs={[openChevronRef, closeChevronRef, drawerRef]}
        containerZIndex={10050}
        backdropZIndex={10040}
        disableClose={showVisitsDrawer}
      >
        <div className="relative overflow-visible">
          <PanelHeader
            title={
              <span className="flex items-center gap-2 break-words max-w-[15vw]">
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                  className="font-bold text-lg"
                />
                <span className="text-muted text-sm">({country.isoCode})</span>
                <VisitedStatusIndicator
                  visited={isVisited}
                  isHome={homeCountry === country.isoCode}
                />
              </span>
            }
          >
            <ActionButton
              onClick={() => setShowVisitsDrawer((v) => !v)}
              ariaLabel={showVisitsDrawer ? "Hide visits" : "Show visits"}
              title={showVisitsDrawer ? "Hide visits" : "Show visits"}
              icon={<ICONS.visits />}
              rounded
            />
            {centerOnCountry && (
              <ActionButton
                onClick={() => centerOnCountry(country?.isoCode || "")}
                ariaLabel="Center map on country"
                title="Center map"
                icon={<ICONS.center />}
                rounded
              />
            )}
            <ActionButton
              onClick={() =>
                window.open(
                  `https://en.wikipedia.org/wiki/${country.name.replace(
                    / /g,
                    "_",
                  )}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              ariaLabel="Open Wikipedia article"
              title="Wikipedia"
              icon={<FaWikipediaW />}
              rounded
            />
            <ActionButton
              onClick={onClose}
              ariaLabel="Close country details"
              title="Close"
              icon={<ICONS.close className="text-2xl" />}
              rounded
            />
          </PanelHeader>
          <CountryDetailsContent country={country} currencies={currencies} />
        </div>
      </Modal>
    </div>
  );
}
