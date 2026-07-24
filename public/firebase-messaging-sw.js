importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseParams = new URL(self.location.href).searchParams;
const firebaseConfig = {
    apiKey: firebaseParams.get('apiKey') || undefined,
    authDomain: firebaseParams.get('authDomain') || undefined,
    projectId: firebaseParams.get('projectId') || undefined,
    messagingSenderId: firebaseParams.get('messagingSenderId') || undefined,
    appId: firebaseParams.get('appId') || undefined,
    measurementId: firebaseParams.get('measurementId') || undefined
};

if (firebaseConfig.apiKey && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const messaging = firebaseConfig.apiKey ? firebase.messaging() : null;

messaging?.onBackgroundMessage((payload) => {
    console.log('[FCM] Background message:', payload);

    const title = payload.notification?.title || 'KBU Connect';
    const options = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/pwa/icon-192x192.png',
        badge: '/pwa/favicon-16.png',
        tag: payload.data?.type || 'kbu-notification',
        data: payload.data
    };

    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data;
    let url = data?.actionUrl || '/';

    if (data?.type === 'NEW_MESSAGE' || data?.type === 'SHOUTOUT_REPLIED') {
        const conversationId = data?.conversationId;
        if (conversationId) url = `/chats/${conversationId}`;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
