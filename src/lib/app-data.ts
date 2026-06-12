import type {
  ConversationItemDto,
  MatchItemDto,
  MessageItemDto,
  PrivateProfileResponseDto,
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

export const fallbackProfiles: DiscoveryProfile[] = [
  {
    id: "demo-alex",
    name: "Alex",
    age: 22,
    faculty: "Faculty of Engineering",
    nationality: "GERMAN",
    bio: "Robotics club, jazz playlists, and late-night library sessions.",
    interests: ["Robotics", "Jazz", "Chess", "Late Night Library"],
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "demo-sophie",
    name: "Sophie",
    age: 21,
    faculty: "Faculty of Architecture",
    nationality: "THAI",
    bio: "Sketching quiet corners on campus and hunting for the best espresso nearby.",
    interests: ["Architecture", "Coffee", "Gallery Walks"],
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
];

export const fallbackMatches: MatchItemDto[] = [
  {
    id: "match-james",
    matchedAt: new Date().toISOString(),
    isNew: true,
    conversationId: "demo-elena" as never,
    matcher: {
      id: "james",
      name: "James",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" as never,
    },
  },
  {
    id: "match-elena",
    matchedAt: new Date(Date.now() - 3600_000).toISOString(),
    isNew: true,
    conversationId: "demo-elena" as never,
    matcher: {
      id: "elena",
      name: "Elena",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" as never,
    },
  },
];

export const fallbackConversations: ConversationItemDto[] = [
  {
    id: "demo-elena",
    otherUser: {
      id: "elena",
      name: "Elena Vance",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" as never,
    },
    isOnline: true,
    isRead: false,
    updatedAt: new Date().toISOString(),
    lastMessage: {
      id: "m1",
      content: "Maybe we could grab coffee at the library cafe soon?",
      senderId: "elena",
      timestamp: new Date(Date.now() - 120_000).toISOString(),
    },
  },
  {
    id: "demo-david",
    otherUser: {
      id: "david",
      name: "David Chen",
      avatarUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" as never,
    },
    isOnline: false,
    isRead: true,
    updatedAt: new Date(Date.now() - 3600_000).toISOString(),
    lastMessage: {
      id: "m2",
      content: "Hey! I saw you're also in the Econ 101 group.",
      senderId: "david",
      timestamp: new Date(Date.now() - 3600_000).toISOString(),
    },
  },
];

export const fallbackMessages: MessageItemDto[] = [
  {
    id: "demo-message-1",
    content:
      "Hey! I saw your profile mentioned Architectural History. Have you visited the new exhibition at the campus gallery?",
    senderId: "elena",
    timestamp: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "demo-message-2",
    content:
      "Hi Elena! Yes, I went there yesterday. The Brutalist section is incredible.",
    senderId: "me",
    timestamp: new Date(Date.now() - 3300_000).toISOString(),
  },
  {
    id: "demo-message-3",
    content:
      "I'd love to hear your thoughts on the curation. Coffee at the library cafe soon?",
    senderId: "elena",
    timestamp: new Date(Date.now() - 3000_000).toISOString(),
  },
];

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

export function profileToDiscovery(
  profile: PrivateProfileResponseDto,
): DiscoveryProfile {
  return {
    id: profile.id,
    name: profile.name,
    age: ageFromBirthYear(profile.birthYear as number | undefined),
    avatarUrl: profile.avatarUrl as string | null,
    faculty: profile.faculty
      ? `Faculty of ${formatEnum(profile.faculty as string)}`
      : null,
    nationality: profile.nationality as string | null,
    bio: profile.bio as string | null,
    interests: (profile.interests ?? []).map(String),
  };
}

export function getDiscoveryProfiles(data: unknown): DiscoveryProfile[] {
  const record = data as Record<string, unknown> | undefined;
  const candidates =
    record?.users ?? record?.profiles ?? record?.items ?? record?.data;
  const array = Array.isArray(candidates)
    ? candidates
    : Array.isArray(data)
      ? data
      : [];
  const profiles = array
    .map((item) => profileToDiscovery(item as PrivateProfileResponseDto))
    .filter((profile) => profile.id && profile.name);

  return profiles.length ? profiles : fallbackProfiles;
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
