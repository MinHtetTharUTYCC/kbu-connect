"use client";

import { useMatchesControllerGetMatches } from "../../../services/generated/matches/matches";

export function useMatchesList(limit = 20) {
  const query = useMatchesControllerGetMatches({ limit });
  const matches = query.data?.matches ?? [];

  return { ...query, matches };
}
