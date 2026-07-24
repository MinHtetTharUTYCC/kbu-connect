import type { Metadata } from 'next';
import { ProfileSetupClient } from './_components/profile-setup-client';

export const metadata: Metadata = {
    title: 'Profile Setup'
};

export default function ProfileSetupPage() {
    return <ProfileSetupClient />;
}
