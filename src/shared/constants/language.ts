export const DEFAULT_LANGUAGE = 'uz';
export const SUPPORTED_LANGUAGES = ['uz'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
