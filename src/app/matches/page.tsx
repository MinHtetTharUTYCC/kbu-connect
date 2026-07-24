import type { Metadata } from 'next';
import { MatchesClient } from './_components/matches-client';

export const metadata: Metadata = {
    title: 'Matches'
};

export default function MatchesPage() {
    return <MatchesClient />;
}
