import type {
  DiscoveryListResponseDto,
  DiscoveryUserItemDto,
  UserSummaryDto,
} from "../../services/model";

export type DiscoveryProfile = {
  id: string;
  name: string;
  age?: number;
  avatarUrl?: string | null;
  faculty?: string | null;
  nationality?: string | null;
  bio?: string | null;
  interests: string[];
};

export function ageFromBirthYear(birthYear?: number | null) {
  if (!birthYear) return undefined;
  return new Date().getFullYear() - birthYear;
}

export function formatEnum(value?: string | null) {
  if (!value) return "";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function discoveryUserToProfile(
  user: DiscoveryUserItemDto,
): DiscoveryProfile {
  const primaryImage = user.gallery.toSorted((a, b) => a.order - b.order).at(0);

  return {
    id: user.id,
    name: user.name,
    avatarUrl: primaryImage?.imageUrl ?? null,
    faculty: user.faculty ? `Faculty of ${formatEnum(user.faculty)}` : null,
    nationality: user.nationality as string | null,
    bio: user.bio as string | null,
    interests: [],
  };
}

export function getDiscoveryProfiles(
  data?: DiscoveryListResponseDto,
): DiscoveryProfile[] {
  return (data?.users ?? [])
    .map(discoveryUserToProfile)
    .filter((profile) => profile.id && profile.name);
}

export function getUserName(user?: UserSummaryDto | null) {
  return user?.name || "KBU student";
}

export function initials(name?: string | null) {
  return (name || "KBU")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function relativeTime(value?: string | null) {
  if (!value) return "Now";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
