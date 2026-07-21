import type { Metadata } from 'next';
import { NotificationClient } from './_components/notification-client';

export const metadata: Metadata = {
    title: 'Notifications'
};

export default function NotificationPage() {
    return <NotificationClient />;
}
