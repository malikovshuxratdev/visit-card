import type { AxiosResponse } from 'axios';
import { baseApiClient } from '@/shared/api';
import type { ProfileResponse } from '@/shared/types';

const urls = {
    getProfile: (pnflCode: string) =>
        `/profile/${encodeURIComponent(pnflCode)}`,
};

export class VisitCardAPI {
    constructor(private api = baseApiClient) {}

    getProfile = async (pnflCode: string) => {
        const result: AxiosResponse<ProfileResponse> = await this.api.get(
            urls.getProfile(pnflCode)
        );
        return result.data;
    };
}

export const visitCardApi = new VisitCardAPI();
