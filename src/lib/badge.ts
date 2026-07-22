export async function setAppBadge(count: number): Promise<void> {
    if (!('setAppBadge' in navigator)) return;

    try {
        if (count <= 0) {
            await navigator.setAppBadge(0);
        } else {
            await navigator.setAppBadge(count);
        }
    } catch {
        // Badge API not supported or permission denied — silently ignore
    }
}

export async function clearAppBadge(): Promise<void> {
    if (!('clearAppBadge' in navigator)) return;

    try {
        await navigator.clearAppBadge();
    } catch {
        // Silently ignore
    }
}
