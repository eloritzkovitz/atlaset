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
import { useFloatingHover } from "@hooks/useFloatingHover";
import type { Country } from "@types";
import { CountryVisitsDrawer } from "./CountryVisitsDrawer";
import ReactDOM from "react-dom";

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
  const openChevronRef = useRef<HTMLButtonElement>(null);
  const closeChevronRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Hover logic for floating chevron
  const { hoverHandlers, floatingHandlers, shouldShowFloating } =
    useFloatingHover(true, 0, "button");

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
          chevronRef={closeChevronRef}
        />
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="p-8 min-w-[540px] max-w-[100vw] w-[350px] shadow-lg relative"
        containerRef={modalRef}
        extraRefs={[openChevronRef, closeChevronRef, drawerRef]}
        containerZIndex={10050}
        backdropZIndex={10040}
        onMouseEnter={hoverHandlers.onMouseEnter}
        onMouseLeave={hoverHandlers.onMouseLeave}
      >
        <div className="relative overflow-visible">
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                <CountryWithFlag
                  isoCode={country.isoCode}
                  name={country.name}
                  className="font-bold text-lg"
                />
                <span className="text-muted text-sm">
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
              rounded
            />
            {onCenterMap && (
              <ActionButton
                onClick={onCenterMap}
                ariaLabel="Center map on country"
                title="Center map"
                icon={<FaCrosshairs />}
                rounded
              />
            )}
            <ActionButton
              onClick={onClose}
              ariaLabel="Close country details"
              title="Close"
              icon={<FaXmark className="text-2xl" />}
              rounded
            />
          </PanelHeader>
          <CountryDetailsContent country={country} currencies={currencies} />
        </div>
      </Modal>
      {!showVisitsDrawer &&
        shouldShowFloating &&
        ReactDOM.createPortal(
          <FloatingChevronButton
            ref={openChevronRef}
            targetRef={modalRef}
            position="right"
            chevronDirection="right"
            onClick={() => setShowVisitsDrawer(true)}
            ariaLabel="Show visits"
            title="Show visits"
            {...floatingHandlers}
          />,
          document.body
        )}
    </div>
  );
}
