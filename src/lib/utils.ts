import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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

export function formatFaculty(value?: string | null) {
    if (!value) return '';

    return value.split('_').join(' ');
}

export function initials(name?: string | null) {
    return (name || 'KBU')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}
