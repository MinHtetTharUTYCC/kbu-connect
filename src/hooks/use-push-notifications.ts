'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { useRegisterDevice } from '@/hooks/use-register-device';
import { getFCMToken, initializeFCM, listenForMessages } from '@/lib/firebase';

export function usePushNotifications() {
    const { user } = useAuthContext();
    const { registerDevice } = useRegisterDevice();
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const setup = async () => {
            try {
                await initializeFCM();

                const token = await getFCMToken();
                if (!token) return;

                setFcmToken(token);
                await registerDevice(token);

                listenForMessages((payload) => {
                    console.log('[FCM] Foreground message:', payload);
                });
            } catch (err) {
                console.error('[FCM] Setup error:', err);
            }
        };

        setup();
    }, [user, registerDevice]);

    return { fcmToken };
}
