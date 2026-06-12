"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { getDiscoveryProfiles } from "@/lib/profile-utils";
import { useDiscoveryControllerGetDiscoveryInfinite } from "../../../services/generated/discovery/discovery";
import type { DiscoveryListResponseDto } from "../../../services/model";

export function useDiscoveryProfiles(limit = 10) {
  const query = useDiscoveryControllerGetDiscoveryInfinite<
    InfiniteData<DiscoveryListResponseDto>
  >(
    { limit },
    {
      query: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => getNextCursor(lastPage.nextCursor),
      },
    },
  );
  const profiles =
    query.data?.pages.flatMap((page) => getDiscoveryProfiles(page)) ?? [];

  return { ...query, profiles };
}

function getNextCursor(nextCursor: unknown) {
  return typeof nextCursor === "string" && nextCursor.length > 0
    ? nextCursor
    : undefined;
}
