import { useMemo } from "react";
import type { Feature, Geometry } from "geojson";
import { ATLAS_PALETTE } from "@constants/colorPalettes";
import { getCountryIsoCode } from "@features/countries";
import type { BoundingBox, Coordinates, GeoData } from "../types";
import { getFeatures } from "../utils/geography";

interface UseAtlasColoringOptions {
  colors?: number;
  palette?: string[];
  enabled?: boolean;
}

/**
 * Computes a coloring map for countries based on their adjacency and proximity.
 * Uses a backtracking graph coloring algorithm with heuristics for optimization.
 * @param geography - The GeoData containing country features.
 * @param colors - The number of colors to use (default: 4).
 * @param palette - An optional array of color strings to use as the palette.
 * @returns An object containing the mapping of country ISO codes to colors and the final palette used.
 */
export function computeAtlasColoring(
  geography: GeoData,
  colors?: number,
  palette?: string[],
) {
  const K = Math.max(colors ?? 4, 1);
  const finalPalette = (palette ?? ATLAS_PALETTE.colors).slice(0, K);

  // If geography data is missing or malformed, return an empty map and the palette
  if (!geography?.features || !Array.isArray(geography.features)) {
    return { map: {} as Record<string, string>, palette: finalPalette };
  }

  const isos: string[] = [];
  const countryCentroids = new Map<string, Coordinates>();
  const countryBounds = new Map<string, BoundingBox>();
  const edgeTokenMap = new Map<string, string[]>();

  const features = getFeatures(
    geography as unknown as Feature<Geometry, Record<string, unknown>>[],
  );

  // First pass: Extract ISO codes, compute centroids and bounding boxes, and build edge tokens for shared borders
  for (const f of features) {
    const props = (f.properties || {}) as Record<string, unknown>;
    const isoRaw =
      getCountryIsoCode(props) ||
      props.ISO_A2 ||
      props.iso_a2 ||
      props.ISO ||
      props.iso ||
      props.BRK_A2;
    if (!isoRaw || typeof isoRaw !== "string" || isoRaw === "-99") continue;

    const iso = isoRaw.toUpperCase().trim();
    if (!isos.includes(iso)) isos.push(iso);

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    let sumX = 0,
      sumY = 0,
      ptCount = 0;

    const walk = (a: unknown) => {
      if (!Array.isArray(a)) return;
      if (
        Array.isArray(a[0]) &&
        a[0].length > 0 &&
        typeof a[0][0] === "number"
      ) {
        const ring = a as number[][];
        for (let i = 0; i < ring.length; i++) {
          const x = ring[i][0],
            y = ring[i][1];
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          sumX += x;
          sumY += y;
          ptCount++;

          if (i < ring.length - 1) {
            const xNext = ring[i + 1][0],
              yNext = ring[i + 1][1];
            const edgeToken =
              x < xNext || (x === xNext && y < yNext)
                ? `${x.toFixed(3)},${y.toFixed(3)}|${xNext.toFixed(3)},${yNext.toFixed(3)}`
                : `${xNext.toFixed(3)},${yNext.toFixed(3)}|${x.toFixed(3)},${y.toFixed(3)}`;

            let list = edgeTokenMap.get(edgeToken);
            if (!list) edgeTokenMap.set(edgeToken, (list = []));
            if (!list.includes(iso)) list.push(iso);
          }
        }
        return;
      }
      for (let i = 0; i < a.length; i++) walk(a[i]);
    };
    walk((f.geometry as { coordinates: unknown })?.coordinates);

    if (ptCount > 0) {
      const curCen = countryCentroids.get(iso);
      countryCentroids.set(
        iso,
        curCen
          ? [(curCen[0] + sumX / ptCount) / 2, (curCen[1] + sumY / ptCount) / 2]
          : [sumX / ptCount, sumY / ptCount],
      );
    }
    const curB = countryBounds.get(iso);
    countryBounds.set(
      iso,
      curB
        ? {
            minX: Math.min(curB.minX, minX),
            minY: Math.min(curB.minY, minY),
            maxX: Math.max(curB.maxX, maxX),
            maxY: Math.max(curB.maxY, maxY),
          }
        : { minX, minY, maxX, maxY },
    );
  }

  const adjSet: Record<string, Set<string>> = Object.fromEntries(
    isos.map((iso) => [iso, new Set<string>()]),
  );

  // Rule Pass 1: Shared Border Topology
  for (const countryList of edgeTokenMap.values()) {
    if (countryList.length < 2) continue;
    for (let i = 0; i < countryList.length; i++) {
      for (let j = i + 1; j < countryList.length; j++) {
        adjSet[countryList[i]].add(countryList[j]);
        adjSet[countryList[j]].add(countryList[i]);
      }
    }
  }

  // Rule Pass 2: Maritime Proximity
  const proximityEligibleIsos = isos.filter((iso) => adjSet[iso].size < 3);
  for (const src of proximityEligibleIsos) {
    const cenA = countryCentroids.get(src),
      boundsA = countryBounds.get(src);
    if (!cenA || !boundsA) continue;

    const candidates: { iso: string; distSq: number }[] = [];
    for (const tgt of isos) {
      if (tgt === src || adjSet[src].has(tgt)) continue;
      const boundsB = countryBounds.get(tgt),
        cenB = countryCentroids.get(tgt);
      if (!boundsB || !cenB) continue;

      if (
        boundsA.minX - 10.0 > boundsB.maxX ||
        boundsB.minX - 10.0 > boundsA.maxX ||
        boundsA.minY - 10.0 > boundsB.maxY ||
        boundsB.minY - 10.0 > boundsA.maxY
      )
        continue;

      const dx = Math.max(
        0,
        boundsA.minX - boundsB.maxX,
        boundsB.minX - boundsA.maxX,
      );
      const dy = Math.max(
        0,
        boundsA.minY - boundsB.maxY,
        boundsB.minY - boundsA.maxY,
      );
      candidates.push({ iso: tgt, distSq: dx * dx + dy * dy });
    }

    candidates.sort((a, b) => a.distSq - b.distSq);
    const targets = candidates.slice(0, adjSet[src].size === 0 ? 3 : 2);
    for (const link of targets) {
      adjSet[src].add(link.iso);
      adjSet[link.iso].add(src);
    }
  }

  // Finalize adjacency list
  const adj: Record<string, string[]> = {};
  for (const iso of isos) {
    adj[iso] = Array.from(adjSet[iso]);
  }

  // Backtracking Graph Coloring with MRV + Degree Heuristic + LCV
  const assignment: Record<string, number> = {};
  let searchBudget = 50000;

  function getNextOptimizedNode(): string | null {
    let selectedNode: string | null = null;
    let minRemainingValues = Infinity,
      maxDegree = -1;

    for (let i = 0; i < isos.length; i++) {
      const iso = isos[i];
      if (assignment[iso] !== undefined) continue;

      let forbiddenCount = 0;
      let unassignedDegree = 0;
      const neighbors = adj[iso];

      const seenColors = new Uint8Array(K);
      for (let j = 0; j < neighbors.length; j++) {
        const c = assignment[neighbors[j]];
        if (c !== undefined) {
          if (seenColors[c] === 0) {
            seenColors[c] = 1;
            forbiddenCount++;
          }
        } else {
          unassignedDegree++;
        }
      }

      const remainingValues = K - forbiddenCount;
      if (
        remainingValues < minRemainingValues ||
        (remainingValues === minRemainingValues && unassignedDegree > maxDegree)
      ) {
        minRemainingValues = remainingValues;
        maxDegree = unassignedDegree;
        selectedNode = iso;
      }
    }
    return selectedNode;
  }

  // Solve function with heuristics
  function solve(): boolean {
    if (searchBudget-- <= 0) return false;
    const node = getNextOptimizedNode();
    if (!node) return true;

    const neighbors = adj[node];
    const forbidden = new Uint8Array(K);
    for (let i = 0; i < neighbors.length; i++) {
      const c = assignment[neighbors[i]];
      if (c !== undefined) forbidden[c] = 1;
    }

    const colorScores: {
      color: number;
      secondaryConflicts: number;
      lookaheadFreedom: number;
    }[] = [];

    for (let c = 0; c < K; c++) {
      if (forbidden[c] === 1) continue;

      let secondaryConflicts = 0,
        lookaheadFreedom = 0;

      for (let i = 0; i < neighbors.length; i++) {
        const nb = neighbors[i];
        if (assignment[nb] === undefined) {
          let nbCanUseColor = true;
          const subNeighbors = adj[nb];
          for (let j = 0; j < subNeighbors.length; j++) {
            if (assignment[subNeighbors[j]] === c) {
              nbCanUseColor = false;
              break;
            }
          }
          if (nbCanUseColor) lookaheadFreedom++;
        }

        const secondaryNeighbors = adj[nb];
        for (let j = 0; j < secondaryNeighbors.length; j++) {
          if (
            secondaryNeighbors[j] !== node &&
            assignment[secondaryNeighbors[j]] === c
          ) {
            secondaryConflicts++;
          }
        }
      }
      colorScores.push({ color: c, secondaryConflicts, lookaheadFreedom });
    }

    colorScores.sort((a, b) =>
      a.secondaryConflicts !== b.secondaryConflicts
        ? a.secondaryConflicts - b.secondaryConflicts
        : b.lookaheadFreedom - a.lookaheadFreedom,
    );

    for (let i = 0; i < colorScores.length; i++) {
      const choice = colorScores[i].color;
      assignment[node] = choice;
      if (solve()) return true;
      delete assignment[node];
    }
    return false;
  }

  if (!solve()) {
    const sortedFallbackNodes = [...isos].sort(
      (a, b) => adj[b].length - adj[a].length,
    );
    for (const node of sortedFallbackNodes) {
      if (assignment[node] !== undefined) continue;
      const conflictWeights = new Int32Array(K);
      const neighbors = adj[node];
      for (let i = 0; i < neighbors.length; i++) {
        const c = assignment[neighbors[i]];
        if (c !== undefined) conflictWeights[c]++;
      }
      let minWeight = Infinity,
        bestColorIndex = 0;
      for (let c = 0; c < K; c++) {
        if (conflictWeights[c] < minWeight) {
          minWeight = conflictWeights[c];
          bestColorIndex = c;
        }
      }
      assignment[node] = bestColorIndex;
    }
  }

  return {
    map: Object.fromEntries(
      Object.entries(assignment).map(([k, v]) => [
        k,
        finalPalette[v % finalPalette.length],
      ]),
    ),
    palette: finalPalette,
  };
}

/**
 * Manages the atlas coloring logic.
 * @param geography - The GeoData containing country features.
 * @param options - Configuration options for coloring, including number of colors, palette, and whether to enable coloring.
 * @returns An object containing the mapping of country ISO codes to colors and the final palette used.
 */
export function useAtlasColoring(
  geography: GeoData,
  options?: UseAtlasColoringOptions,
) {
  const isEnabled = options?.enabled ?? true;

  return useMemo(() => {
    const K = Math.max(options?.colors ?? 4, 1);
    const finalPalette = (options?.palette ?? ATLAS_PALETTE.colors).slice(0, K);

    // Completely skip calling the utility engine if disabled
    if (!isEnabled) {
      return { map: {} as Record<string, string>, palette: finalPalette };
    }

    return computeAtlasColoring(geography, options?.colors, options?.palette);
  }, [geography, options?.colors, options?.palette, isEnabled]);
}
