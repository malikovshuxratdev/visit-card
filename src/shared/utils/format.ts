/** Formats a raw phone number (e.g. "998901234567") as "+998901234567". */
export const formatPhone = (value: string | null | undefined): string => {
    const digits = (value ?? '').replace(/[^\d]/g, '');
    return digits ? `+${digits}` : '';
};
