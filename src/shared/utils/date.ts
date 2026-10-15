import dayjs from 'dayjs';

/** Formats an API date as DD.MM.YYYY, or returns `fallback` for empty/invalid values. */
export const formatDate = (
    value: string | null | undefined,
    fallback: string
): string => {
    if (!value) return fallback;
    const date = dayjs(value);
    return date.isValid() ? date.format('DD.MM.YYYY') : fallback;
};
