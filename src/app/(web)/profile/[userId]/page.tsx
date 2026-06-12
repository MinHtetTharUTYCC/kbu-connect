import {
  Avatar,
  Chip,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";
import { fallbackProfiles } from "@/lib/app-data";

interface ProfileIdPageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfileIdPage({ params }: ProfileIdPageProps) {
  const { userId } = await params;
  const profile =
    fallbackProfiles.find((item) => item.id === userId) ?? fallbackProfiles[0];

  return (
    <MobileScreen>
      <TopBar title={profile.name} backHref="/matches" />
      <main className="flex flex-1 flex-col px-5 py-8">
        <section className="flex flex-col items-center text-center">
          <Avatar
            src={profile.avatarUrl}
            name={profile.name}
            className="size-28"
          />
          <h1 className="mt-5 text-2xl font-bold">
            {profile.name}
            {profile.age ? `, ${profile.age}` : ""}
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">{profile.faculty}</p>
          <p className="mt-4 max-w-[320px] text-sm leading-6">{profile.bio}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {profile.interests.map((interest) => (
              <Chip key={interest}>{interest}</Chip>
            ))}
          </div>
        </section>
      </main>
    </MobileScreen>
  );
}
