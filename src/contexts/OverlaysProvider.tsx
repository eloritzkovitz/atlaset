import { useEffect, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import {
  overlaysService,
  useSyncVisitedCountriesOverlay,
  type AnyOverlay,
} from "@features/atlas/overlays";
import { logUserActivity } from "@features/user";
import { useAuth } from "./AuthContext";
import { OverlaysContext } from "./OverlaysContext";

export function OverlaysProvider({ children }: { children: React.ReactNode }) {
  // Overlay state
  const [overlays, setOverlays] = useState<AnyOverlay[]>([]);
  const [overlaySelections, setOverlaySelections] = useState<
    Record<string, string>
  >({});

  // Trips context for syncing visited countries overlay
  const { trips } = useTrips();

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingOverlay, setEditingOverlay] = useState<AnyOverlay | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const isEditingOverlay =
    !!editingOverlay && overlays.some((o) => o.id === editingOverlay.id);

  // Fetch overlays on mount
  const { user, ready } = useAuth();

  // Load overlays when auth state changes
  useEffect(() => {
    let mounted = true;
    if (!ready) return;
    overlaysService
      .load()
      .then((dbOverlays) => {
        if (mounted) {
          setOverlays(dbOverlays);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user, ready]);

  // Sync visited countries overlay with trips
  useSyncVisitedCountriesOverlay(trips, overlays, setOverlays, loading);

  // Import overlays from JSON
  async function importOverlays(newOverlays: AnyOverlay[]) {
    const existingIds = new Set(overlays.map((o) => o.id));
    const uniqueNewOverlays = newOverlays.filter((o) => !existingIds.has(o.id));
    const merged = [...overlays, ...uniqueNewOverlays];

    // Log "add_overlay" for each new overlay
    for (const overlay of uniqueNewOverlays) {
      await logUserActivity(
        211,
        {
          overlayId: overlay.id,
          itemName: overlay.name,
        },
        user!.uid
      );
    }

    // Save all overlays and log "save_overlays" once
    await overlaysService.save(merged);
    setOverlays(merged);
  }

  // Add overlay
  async function addOverlay(overlay: AnyOverlay) {
    await overlaysService.add(overlay);
    const dbOverlays = await overlaysService.load();
    if (dbOverlays.length > 0) setOverlays(dbOverlays);
  }

  // Edit overlay
  async function editOverlay(overlay: AnyOverlay) {
    await overlaysService.edit(overlay);
    const dbOverlays = await overlaysService.load();
    if (dbOverlays.length > 0) setOverlays(dbOverlays);
  }

  // Remove overlay
  async function removeOverlay(id: string) {
    await overlaysService.remove(id);
    const dbOverlays = await overlaysService.load();
    setOverlays(dbOverlays);
  }

  // Reorder overlays
  async function reorderOverlays(newOrder: AnyOverlay[]) {
    const ordered = newOrder.map((overlay, idx) => ({
      ...overlay,
      order: idx,
    }));
    await overlaysService.save(ordered);
    const dbOverlays = await overlaysService.load();
    setOverlays(dbOverlays);
  }

  // Toggle visibility
  async function toggleOverlayVisibility(id: string) {
    const updated = overlays.map((o) =>
      o.id === id ? { ...o, visible: !o.visible } : o
    );
    await overlaysService.save(updated);
    setOverlays(updated);
  }

  // Modal handlers
  function openAddOverlay() {
    setEditingOverlay({
      id: crypto.randomUUID(),
      name: "",
      color: "#2563eb",
      countries: [],      
      filterLabels: {
        all: "All",
        only: "Include only",
        exclude: "Exclude",
      },
      visible: true,
    });
    setEditModalOpen(true);
  }

  // Open edit modal with selected overlay
  function openEditOverlay(overlay: AnyOverlay) {
    setEditingOverlay({ ...overlay });
    setEditModalOpen(true);
  }

  // Save overlay (add or edit)
  async function saveOverlay() {
    if (!editingOverlay) return;
    const exists = overlays.some((o) => o.id === editingOverlay.id);
    if (exists) {
      await editOverlay(editingOverlay);
    } else {
      await addOverlay(editingOverlay);
    }
    closeOverlayModal();
  }

  // Close modal and reset state
  function closeOverlayModal() {
    setEditModalOpen(false);
    setEditingOverlay(null);
  }

  return (
    <OverlaysContext.Provider
      value={{
        overlays,
        setOverlays,
        overlaySelections,
        setOverlaySelections,
        importOverlays,
        addOverlay,
        editOverlay,
        removeOverlay,
        reorderOverlays,
        toggleOverlayVisibility,
        loading,
        error,
        editingOverlay,
        isEditingOverlay,
        isEditModalOpen,
        openAddOverlay,
        openEditOverlay,
        saveOverlay,
        closeOverlayModal,
        setEditingOverlay,
      }}
    >
      {children}
    </OverlaysContext.Provider>
  );
}
