import { ProfileClient } from './_components/profile-client';

interface ProfileIdPageProps {
    params: Promise<{ userId: string }>;
}

export default async function ProfileIdPage({ params }: ProfileIdPageProps) {
    const { userId } = await params;
    return <ProfileClient userId={userId} />;
}
