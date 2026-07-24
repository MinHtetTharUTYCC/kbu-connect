import type { Metadata } from 'next';
import { DiscoverClient } from './_components/discover-client';

export const metadata: Metadata = {
    title: 'Discover'
};

export default function DiscoverPage() {
    return <DiscoverClient />;
}
