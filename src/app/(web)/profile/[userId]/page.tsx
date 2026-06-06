interface ProfileIdPageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfileIdPage({ params }: ProfileIdPageProps) {
  const { userId } = await params;
  return <div>Profile Id Page - {userId}</div>;
}
