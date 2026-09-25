import { useCallback, useEffect } from "react";

export type ConditionToggle = "sovereign" | "visited" | "wantToVisit";

export const CONDITIONS: Record<
  ConditionToggle,
  { prefix: string; search: string }
> = {
  sovereign: {
    prefix: "sovereign",
    search: "sovereign:true",
  },
  visited: {
    prefix: "visited",
    search: "visited:true",
  },
  wantToVisit: {
    prefix: "wanttovisit",
    search: "wanttovisit:true",
  },
};

// Checks if the search string contains a condition prefix and returns the corresponding toggle if found.
export function getSearchCondition(value: string): ConditionToggle | null {
  const normalized = value.trim().toLowerCase();

  for (const [toggle, { prefix }] of Object.entries(CONDITIONS) as [
    ConditionToggle,
    (typeof CONDITIONS)[ConditionToggle],
  ][]) {
    const pattern = new RegExp(`^${prefix}\\s*:\\s*true(?:\\s|$)`, "i");

    if (pattern.test(normalized)) {
      return toggle;
    }
  }

  return null;
}

interface UseSearchConditionSyncOptions {
  search: string;
  timelineMode: boolean;
  setSovereignOnly?: (value: boolean) => void;
  setVisitedOnly?: (value: boolean) => void;
  setWantToVisitOnly?: (value: boolean) => void;
  setSelectedListId?: (id: string | null) => void;
}

/** Syncs the search condition with the appropriate state based on the search query. */
export function useSearchCondition({
  search,
  timelineMode,
  setVisitedOnly,
  setWantToVisitOnly,
  setSovereignOnly,
  setSelectedListId,
}: UseSearchConditionSyncOptions) {
  const setCondition = useCallback(
    (condition: ConditionToggle | null) => {
      setVisitedOnly?.(condition === "visited");
      setWantToVisitOnly?.(condition === "wantToVisit");
      setSovereignOnly?.(condition === "sovereign");
      setSelectedListId?.(null);
    },
    [setVisitedOnly, setWantToVisitOnly, setSovereignOnly, setSelectedListId],
  );

  // Update condition based on search changes, but only if not in timeline mode
  useEffect(() => {
    if (timelineMode) {
      return;
    }

    const condition = getSearchCondition(search);

    setCondition(condition);
  }, [search, timelineMode, setCondition]);

  return {
    conditions: CONDITIONS,
    setCondition,
  };
}
