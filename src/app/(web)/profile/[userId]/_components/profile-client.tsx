"use client";

import {
  Avatar,
  Chip,
  EmptyState,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";
import { useUserProfile } from "@/hooks/users/use-user-profile";
import { ageFromBirthYear, formatEnum } from "@/lib/profile-utils";

export function ProfileClient({ userId }: { userId: string }) {
  const profileQuery = useUserProfile(userId);
  const profile = profileQuery.data;

  if (profileQuery.isLoading) {
    return (
      <MobileScreen>
        <TopBar title="Profile" backHref="/matches" />
        <EmptyState
          title="Loading profile"
          body="Fetching the latest profile details."
        />
      </MobileScreen>
    );
  }

  if (!profile) {
    return (
      <MobileScreen>
        <TopBar title="Profile" backHref="/matches" />
        <EmptyState
          title="Profile unavailable"
          body="This profile could not be loaded from the API."
        />
      </MobileScreen>
    );
  }

  const age = ageFromBirthYear(profile.birthYear as number | undefined);
  const interests = (profile.interests ?? []).map(String);

  return (
    <MobileScreen>
      <TopBar title={profile.name} backHref="/matches" />
      <main className="flex flex-1 flex-col px-5 py-8">
        <section className="flex flex-col items-center text-center">
          <Avatar
            src={profile.avatarUrl as string | null}
            name={profile.name}
            className="size-28"
          />
          <h1 className="mt-5 text-2xl font-bold">
            {profile.name}
            {age ? `, ${age}` : ""}
          </h1>
          {profile.faculty && (
            <p className="mt-2 text-sm text-[#6b6b6b]">
              Faculty of {formatEnum(profile.faculty as string)}
            </p>
          )}
          {profile.bio && (
            <p className="mt-4 max-w-[320px] text-sm leading-6">
              {String(profile.bio)}
            </p>
          )}
          {interests.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {interests.map((interest) => (
                <Chip key={interest}>{interest}</Chip>
              ))}
            </div>
          )}
        </section>
      </main>
    </MobileScreen>
  );
}
