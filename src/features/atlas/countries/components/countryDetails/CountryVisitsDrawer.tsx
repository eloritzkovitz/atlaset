import React, { useRef, useLayoutEffect, useState } from "react";
import {
  EmptyListMessage,
  Modal,
  PanelHeader,
  ActionButton,
} from "@components";
import { ICONS } from "@constants/icons";
import { FaChevronLeft } from "react-icons/fa6";
import type { Visit } from "@features/visits";
import { VisitSection } from "./VisitSection";

interface CountryVisitsDrawerProps {
  open: boolean;
  onClose: () => void;
  visits: {
    past: Visit[];
    upcoming: Visit[];
    tentative: Visit[];
  };
  targetRef: React.RefObject<HTMLElement | null>;
  chevronRef?: React.RefObject<HTMLButtonElement | null>;
}

export function CountryVisitsDrawer({
  open,
  onClose,
  visits,
  targetRef,
  chevronRef,
}: CountryVisitsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [drawerStyle, setDrawerStyle] = useState<React.CSSProperties>({});
  const [exiting, setExiting] = useState(false);

  // Destructure categorized visits
  const {
    past: pastVisits,
    upcoming: upcomingVisits,
    tentative: tentativeVisits,
  } = visits;
  const totalVisits =
    pastVisits.length + upcomingVisits.length + tentativeVisits.length;

  // Position the drawer to the right of the main modal
  useLayoutEffect(() => {
    if (open && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setDrawerStyle({
        position: "fixed",
        top: rect.top,
        left: rect.right,
        height: rect.height,
        width: 320,
      });
    }
  }, [open, targetRef]);

  // Handle close with exit animation
  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      onClose();
    }, 300);
  };

  // Don't render anything if not open and not exiting
  if (!open && !exiting) return null;

  return (
    <Modal
      isOpen={open || exiting}
      onClose={handleClose}
      className={`transition-transform duration-300 ease-in-out shadow-lg ${
        exiting ? "-translate-x-full" : "translate-x-0"
      }`}
      style={drawerStyle}
      containerZIndex={10030}
      backdropZIndex={10020}
      position="custom"
      disableClose
      containerRef={drawerRef}
      extraRefs={[chevronRef as React.RefObject<HTMLElement>]}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              <ICONS.visits />
              Visits{totalVisits > 0 ? ` (${totalVisits})` : ""}
            </span>
          }
          showSeparator={true}
        >
          <ActionButton
            icon={<FaChevronLeft />}
            ariaLabel="Collapse"
            title="Collapse"
            rounded
            onClick={handleClose}
          />
        </PanelHeader>
        <div className="rounded flex-1 p-4 overflow-y-auto ">
          {totalVisits > 0 ? (
            <>
              <VisitSection
                icon={<ICONS.tripPlanned />}
                title={`Planned (${tentativeVisits.length})`}
                visits={tentativeVisits}
              />
              <VisitSection
                icon={<ICONS.tripUpcoming />}
                title={`Upcoming (${upcomingVisits.length})`}
                visits={upcomingVisits}
              />
              <VisitSection
                icon={<ICONS.tripCompleted />}
                title={`Completed (${pastVisits.length})`}
                visits={pastVisits}
              />
            </>
          ) : (
            <EmptyListMessage message="No visits recorded." />
          )}
        </div>
      </div>
    </Modal>
  );
}
