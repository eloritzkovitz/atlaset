import React, { useRef, useLayoutEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FloatingChevronButton, Modal } from "@components";
import type { Visit } from "@types";

interface CountryVisitsDrawerProps {
  open: boolean;
  onClose: () => void;
  visits: Visit[];
  targetRef: React.RefObject<HTMLElement | null>;
};

export function CountryVisitsDrawer({
  open,
  onClose,
  visits,
  targetRef,
}: CountryVisitsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [drawerStyle, setDrawerStyle] = useState<React.CSSProperties>({});
  const [exiting, setExiting] = useState(false);

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
        zIndex: 10,
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
      className={`transition-transform duration-300 ease-in-out ${
        exiting ? "-translate-x-full" : "translate-x-0"
      }`}
      style={drawerStyle}
      position="custom"
      containerClassName="z-40"
      backdropClassName="z-30"
      floatingChildren={
        !exiting ? (
          <FloatingChevronButton
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
    >
      <div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 h-8 text-lg font-bold mb-4">
              <FaLocationDot />
              Visits{visits.length > 0 ? ` (${visits.length})` : ""}
            </div>
            <div className="rounded p-3 mb-2 flex-1 overflow-y-auto">
              {visits.length ? (
                <ul className="list-disc pl-5">
                  {visits.map((visit, i) => (
                    <li key={i}>
                      <span className="font-semibold">{visit.yearRange}</span>
                      {visit.tripName && (
                        <span className="ml-2 text-gray-400">
                          ({visit.tripName})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm">No visits recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
