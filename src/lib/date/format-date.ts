import {
    format,
    isThisWeek,
    isThisYear,
    isToday,
    isYesterday,
    formatDistanceToNow,
    isThisMonth,
} from 'date-fns';

export function getFormattedDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (isToday(date)) {
        return `Today ${format(date, 'hh:mm a')}`;
    } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'hh:mm a')}`;
    } else if (isThisWeek(date)) {
        return format(date, `EEE \'at'\ hh:mm a`);
    } else if (isThisMonth(date)) {
        return format(date, `MMM d`);
    } else if (isThisYear(date)) {
        return format(date, `MMM d \'at'\ hh:mm a`);
    } else {
        //other years
        return format(date, 'MMM d, yyyy');
    }
}

export function formatDateToNow(dateStr: string): string {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
}
