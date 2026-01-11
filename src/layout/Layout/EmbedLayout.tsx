import React from "react";
import { Branding } from "../Branding/Branding";

interface EmbedLayoutProps {
  children: React.ReactNode;
  mapCode?: string;
}

export function EmbedLayout({ children, mapCode }: EmbedLayoutProps) {
  // Build the full map URL (readonly, no embed param)
  const fullMapUrl = mapCode
    ? `${window.location.origin}/atlas?map=${mapCode}`
    : `${window.location.origin}/atlas`;

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center relative">
      {/* Branding bar */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between z-10">
        <div className="bg-bg/40 px-2 flex items-center gap-2 rounded">
          <Branding size={36} forceExternal={true} />
          <span className="font-bold text-2xl select-none">Atlaset</span>
        </div>
        <div className="mr-4 mt-4">
          {mapCode && (
            <a
              href={fullMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white rounded px-5 py-2 font-semibold text-base shadow-sm hover:bg-blue-700 transition-colors"
            >
              View Full Map
            </a>
          )}
        </div>
      </div>
      {/* Map content */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
