"use client";

import { fallbackMatches } from "@/lib/app-data";
import { useMatchesControllerGetMatches } from "../../../services/generated/matches/matches";

export function useMatchesList(limit = 20) {
  const query = useMatchesControllerGetMatches({ limit });
  const matches = query.data?.matches?.length
    ? query.data.matches
    : fallbackMatches;

  return { ...query, matches };
}
