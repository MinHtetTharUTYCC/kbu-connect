import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: ReturnType<typeof initializeApp> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;

function getFirebaseServiceWorkerUrl() {
    const params = new URLSearchParams({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '',
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? ''
    });

    return `/firebase-messaging-sw.js?${params.toString()}`;
}

async function getServiceWorkerRegistration() {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
        return undefined;
    }

    const existing = await navigator.serviceWorker.getRegistration('/');
    if (existing) return existing;

    const reg = await navigator.serviceWorker.register(getFirebaseServiceWorkerUrl(), {
        scope: '/'
    });

    // Wait for the SW to be activated
    if (reg.installing) {
        await new Promise<void>((resolve) => {
            const sw = reg.installing;
            sw?.addEventListener('statechange', (e) => {
                if ((e.target as ServiceWorker).state === 'activated') resolve();
            });
        });
    }

    return reg;
}

export async function initializeFCM() {
    try {
        if (!app) {
            app = initializeApp(firebaseConfig);
            messaging = getMessaging(app);
        }
        return messaging;
    } catch (error) {
        console.error('Failed to initialize FCM:', error);
        throw error;
    }
}

export async function getFCMToken(): Promise<string | null> {
    try {
        if (!messaging) {
            await initializeFCM();
        }

        if (!('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return null;
        }

        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Notification permission denied');
                return null;
            }
        }

        const token = await getToken(messaging as ReturnType<typeof getMessaging>, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: await getServiceWorkerRegistration()
        });

        if (token) {
            console.log('[FCM] Token obtained:', token.substring(0, 20));
            return token;
        }

        console.warn('[FCM] No token available');
        return null;
    } catch (error) {
        console.error('[FCM] Error getting token:', error);
        return null;
    }
}

export function listenForMessages(onMessageHandler: (payload: unknown) => void) {
    if (!messaging) {
        console.warn('[FCM] Not initialized');
        return;
    }

    onMessage(messaging, (payload) => {
        console.log('[FCM] Foreground message:', payload);
        onMessageHandler(payload);
    });
}
