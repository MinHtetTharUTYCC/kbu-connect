import { format, formatDistanceToNow, isThisMonth, isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns';

export function getFormattedDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (isToday(date)) {
        return `Today ${format(date, 'hh:mm a')}`;
    } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'hh:mm a')}`;
    } else if (isThisWeek(date)) {
        return format(date, `EEE 'at' hh:mm a`);
    } else if (isThisMonth(date)) {
        return format(date, `MMM d`);
    } else if (isThisYear(date)) {
        return format(date, `MMM d 'at' hh:mm a`);
    } else {
        //other years
        return format(date, 'MMM d, yyyy');
    }
}

export function formatDateToNow(dateStr: string): string {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
}

export function getLastSeenToday(dateString: string): string | null {
    const now = new Date();
    const date = new Date(dateString);

    // biome-ignore lint/suspicious/noGlobalIsNan: <>
    if (isNaN(date.getTime())) {
        console.error('Invalid timestamp:', dateString, date.getTime(), date);
        return null;
    }

    const oneDayMs = 24 * 60 * 60 * 1000;
    const diffMs = now.getTime() - date.getTime();

    if (diffMs > oneDayMs || diffMs < 0) {
        return null;
    }

    if (diffMs < 60 * 1000) {
        return '1m';
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    } else {
        return `${diffHours}h`;
    }
}
