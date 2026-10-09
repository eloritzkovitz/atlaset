/**
 * Utility functions for determining the progress bar and icon colors for different regions.
 */

const REGION_PROGRESS_COLORS: Record<string, { bar: string; icon: string }> = {
  africa: {
    bar: "bg-lime-400",
    icon: "text-lime-400",
  },
  asia: {
    bar: "bg-amber-400",
    icon: "text-amber-400",
  },
  europe: {
    bar: "bg-blue-400",
    icon: "text-blue-400",
  },
  americas: {
    bar: "bg-rose-400",
    icon: "text-rose-400",
  },
  oceania: {
    bar: "bg-violet-400",
    icon: "text-violet-400",
  },
  antarctic: {
    bar: "bg-slate-400",
    icon: "text-slate-400",
  },
};

/** Returns the progress bar and icon classes for a given region. */
function getRegionColors(region: string) {
  return (
    REGION_PROGRESS_COLORS[region.trim().toLowerCase()] ?? {
      bar: "bg-primary",
      icon: "text-primary",
    }
  );
}

/** Returns the progress bar class for a given region. */
export function getRegionProgressBarClass(region: string): string {
  return getRegionColors(region).bar;
}

/** Returns the progress icon class for a given region. */
export function getRegionProgressIconClass(region: string): string {
  return getRegionColors(region).icon;
}
