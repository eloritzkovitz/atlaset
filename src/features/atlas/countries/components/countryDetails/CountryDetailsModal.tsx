import { useState, useRef, useEffect } from "react";
import { FaWikipediaW, FaCrosshairs, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  ErrorMessage,
  FloatingChevronButton,
  LoadingSpinner,
  Modal,
  PanelHeader,
} from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import {
  CountryDetailsContent,
  CountryWithFlag,
  VisitedStatusIndicator,
} from "@features/countries";
import { useHomeCountry } from "@features/settings";
import { useVisitedCountries } from "@features/visits";
import { useKeyHandler } from "@hooks/useKeyHandler";
import type { Country } from "@types";
import { CountryVisitsDrawer } from "./CountryVisitsDrawer";

interface CountryDetailsModalProps {
  isOpen: boolean;
  country: Country | null;
  onCenterMap?: () => void;
  onClose: () => void;
}

export function CountryDetailsModal({
  isOpen,
  country,
  onCenterMap,
  onClose,
}: CountryDetailsModalProps) {
  const { currencies, loading, error } = useCountryData();
  const { isCountryVisited, getCountryVisits } = useVisitedCountries();
  const isVisited = country ? isCountryVisited(country.isoCode) : false;
  const visits = country ? getCountryVisits(country.isoCode) : [];
  const [showVisitsDrawer, setShowVisitsDrawer] = useState(false);

  // Get home country from settings
  const { homeCountry } = useHomeCountry();

  // For positioning the drawer and chevron
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-close drawer when modal closes
  useEffect(() => {
    if (!isOpen) setShowVisitsDrawer(false);
  }, [isOpen]);

  // Center map handler
  useKeyHandler(
    (e) => {
      e.preventDefault();
      if (onCenterMap) onCenterMap();
    },
    ["x", "X"],
    isOpen
  );

  // Show loading or error states
  if (loading) return <LoadingSpinner message="Loading..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!country) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      {/* Visits Drawer */}
      {showVisitsDrawer && (
        <CountryVisitsDrawer
          open={showVisitsDrawer}
          onClose={() => setShowVisitsDrawer(false)}
          visits={visits}
          targetRef={modalRef}
        />
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="bg-white rounded-xl p-8 min-w-[540px] max-w-[100vw] w-[350px] shadow-lg relative"
        containerRef={modalRef}
        floatingChildren={
          (!showVisitsDrawer && (
            <FloatingChevronButton
              targetRef={modalRef}
              position="right"
              chevronDirection="right"
              onClick={() => setShowVisitsDrawer(true)}
              ariaLabel="Show visits"
              title="Show visits"
            />
          )) ||
          undefined
        }
        useFloatingHover={true}
      >
        <div ref={modalRef} className="relative overflow-visible">
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                  className="font-bold text-lg"
                />
                <span className="text-gray-500 text-sm">
                  ({country.isoCode})
                </span>
                <VisitedStatusIndicator
                  visited={isVisited}
                  isHome={homeCountry === country.isoCode}
                />
              </span>
            }
          >
            <ActionButton
              onClick={() =>
                window.open(
                  `https://en.wikipedia.org/wiki/${country.name.replace(
                    / /g,
                    "_"
                  )}`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              ariaLabel="Open Wikipedia article"
              title="Wikipedia"
              icon={<FaWikipediaW />}
            />
            {onCenterMap && (
              <ActionButton
                onClick={onCenterMap}
                ariaLabel="Center map on country"
                title="Center map"
                icon={<FaCrosshairs />}
              />
            )}
            <ActionButton
              onClick={onClose}
              ariaLabel="Close country details"
              title="Close"
              icon={<FaXmark />}
              className="action-btn action-btn-close"
            />
          </PanelHeader>
          <CountryDetailsContent country={country} currencies={currencies} />
        </div>
      </Modal>
    </div>
  );
}
