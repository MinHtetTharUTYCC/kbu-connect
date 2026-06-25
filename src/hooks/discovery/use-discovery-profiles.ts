"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { getDiscoveryProfiles } from "@/lib/profile-utils";
import { useDiscoveryControllerGetDiscoveryInfinite } from "../../../services/generated/discovery/discovery";
import {
  DiscoveryControllerGetDiscoveryParams,
  DiscoveryListResponseDto,
} from "../../../services/model";

export function useDiscoveryProfiles(
  params: DiscoveryControllerGetDiscoveryParams,
) {
  const query = useDiscoveryControllerGetDiscoveryInfinite<
    InfiniteData<DiscoveryListResponseDto>
  >(params, {
    query: {
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  });

  const profiles =
    query.data?.pages.flatMap((page) => getDiscoveryProfiles(page)) ?? [];

  return { ...query, profiles };
}
