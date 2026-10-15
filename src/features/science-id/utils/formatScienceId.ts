/** Science ID format: 3 letters + 8 digits, shown as "ABC-0000-0000". */
export const SCIENCE_ID_LENGTH = 13;

export const formatScienceId = (raw: string): string => {
    const value = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const letters = value.slice(0, 3).replace(/[^A-Z]/g, '');
    // Digits are accepted only after all three letters are typed.
    const digits =
        letters.length === 3
            ? value.slice(3).replace(/[^0-9]/g, '').slice(0, 8)
            : '';

    let formatted = letters;
    if (digits.length > 0) formatted += `-${digits.slice(0, 4)}`;
    if (digits.length > 4) formatted += `-${digits.slice(4, 8)}`;
    return formatted;
};

export const isValidScienceId = (value: string) =>
    /^[A-Z]{3}-\d{4}-\d{4}$/.test(value);
