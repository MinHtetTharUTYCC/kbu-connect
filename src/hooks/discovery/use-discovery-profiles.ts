"use client";

import { useMemo } from "react";
import { getDiscoveryProfiles } from "@/lib/app-data";
import { useDiscoveryControllerGetDiscovery } from "../../../services/generated/discovery/discovery";

export function useDiscoveryProfiles(limit = 10) {
  const query = useDiscoveryControllerGetDiscovery({ limit });
  const profiles = useMemo(
    () => getDiscoveryProfiles(query.data),
    [query.data],
  );

  return { ...query, profiles };
}
