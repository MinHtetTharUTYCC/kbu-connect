export function ageFromBirthYear(birthYear?: number | null) {
    if (!birthYear) return undefined;
    return new Date().getFullYear() - birthYear;
}

export function formatEnum(value?: string | null) {
    if (!value) return '';
    return value
        .toLowerCase()
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function initials(name?: string | null) {
    return (name || 'KBU')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export function relativeTime(value?: string | null) {
    if (!value) return 'Now';
    const diff = Date.now() - new Date(value).getTime();
    const minutes = Math.max(1, Math.round(diff / 60_000));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
}
