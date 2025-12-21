import { createContext, useContext } from "react";
import type { AnyOverlay } from "@types";

export interface OverlaysContextType {
  overlays: AnyOverlay[];
  setOverlays: React.Dispatch<React.SetStateAction<AnyOverlay[]>>;
  overlaySelections: Record<string, string>;
  setOverlaySelections: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  importOverlays: (newOverlays: AnyOverlay[]) => Promise<void>;
  addOverlay: (overlay: AnyOverlay) => void;
  editOverlay: (overlay: AnyOverlay) => void;
  removeOverlay: (id: string) => void;
  reorderOverlays: (newOrder: AnyOverlay[]) => void;
  toggleOverlayVisibility: (id: string) => void;
  loading: boolean;
  error: string | null;
  editingOverlay: AnyOverlay | null;
  isEditingOverlay: boolean;
  isEditModalOpen: boolean;
  openAddOverlay: () => void;
  openEditOverlay: (overlay: AnyOverlay) => void;
  saveOverlay: () => void;
  closeOverlayModal: () => void;
  setEditingOverlay: React.Dispatch<React.SetStateAction<AnyOverlay | null>>;
}

export const OverlaysContext = createContext<OverlaysContextType | undefined>(undefined);

export function useOverlays() {
  const context = useContext(OverlaysContext);
  if (!context) {
    throw new Error("useOverlays must be used within an OverlaysProvider");
  }
  return context;
}
