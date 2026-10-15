import type { Profile } from '@/shared/types';

/** Natural size of the on-screen card in CSS px (≈ CR80 85.6 × 54 mm). */
export const CARD_WIDTH = 450;
export const CARD_HEIGHT = 280;

/** 450px × 4 = 1800px wide ≈ 534 DPI on an 85.6mm card. */
export const CARD_EXPORT_PIXEL_RATIO = 4;

/** Physical CR80 card size used for the print page. */
export const PRINT_PAGE_MM = { width: 85.6, height: 53.98 } as const;

/**
 * Colour correction applied only to the image sent to the printer.
 *
 * Card printers (YMCKO ribbons) reproduce light pastel artwork washed out and
 * print dark-grey text with mixed C+M+Y dye, which looks soft and brownish.
 * Boosting saturation/contrast and snapping near-black neutral pixels to pure
 * #000 (printed with the sharp K resin panel) fixes both. Tune these values
 * for the specific printer if needed: 1 = unchanged.
 */
export const PRINT_COLOR_PROFILE = {
    saturation: 1.3,
    contrast: 1.1,
    brightness: 0.98,
    /** Pixels darker than this (0–255) and nearly neutral become pure black. */
    blackThreshold: 64,
    /** Max channel spread for a pixel to count as neutral (grey/black). */
    neutralTolerance: 28,
} as const;

/** How long the "printing" screen stays before returning home. */
export const PRINTING_REDIRECT_SECONDS = 45;

export const SAMPLE_PROFILE: Profile = {
    science_id: 'MMM-0000-0000',
    first_name: 'AKROM',
    sur_name: 'IKROMOV',
    mid_name: 'MURODOVICH',
    birth_date: '2000-01-01',
    email: 'example@gmail.com',
    phone_number: '998901234567',
    registered_at: '2025-01-01',
    degree_name: 'PhD',
    title: 'Professor',
    photo: null,
};
