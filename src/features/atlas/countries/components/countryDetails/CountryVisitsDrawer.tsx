import React, { useRef, useLayoutEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FloatingChevronButton, Modal } from "@components";
import type { Visit } from "@types";
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
      floatingChildren={
        !exiting ? (
          <FloatingChevronButton
            ref={chevronRef}
            targetRef={drawerRef}
            position="right"
            chevronDirection="left"
            onClick={handleClose}
            ariaLabel="Collapse visits"
            title="Collapse visits"
            positionKey={JSON.stringify(drawerStyle)}
          />
        ) : undefined
      }
      disableClose
      containerRef={drawerRef}
      extraRefs={[chevronRef as React.RefObject<HTMLElement>]}
    >
      <div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 h-8 text-lg font-bold mb-4">
              <FaLocationDot />
              Visits{totalVisits > 0 ? ` (${totalVisits})` : ""}
            </div>
            <div className="rounded p-3 mb-2 flex-1 overflow-y-auto">
              {totalVisits > 0 ? (
                <>
                  <VisitSection
                    title={`Past Visits (${pastVisits.length})`}
                    visits={pastVisits}
                  />
                  <VisitSection
                    title={`Upcoming Visits (${upcomingVisits.length})`}
                    visits={upcomingVisits}
                  />
                  <VisitSection
                    title={`Planned (${tentativeVisits.length})`}
                    visits={tentativeVisits}
                    getLabel={() => "TBD"}
                  />
                </>
              ) : (
                <div className="text-muted text-sm">No visits recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
