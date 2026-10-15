export const SCIENCE_ID_URL = 'https://id.ilmiy.uz';

export const scienceIdCardUrl = (scienceId: string) =>
    `${SCIENCE_ID_URL}/user/card/${scienceId}`;
