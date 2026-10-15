import type { AxiosResponse } from 'axios';
import { baseApiClient } from '@/shared/api';
import type { ProfileResponse } from '@/shared/types';

const urls = {
    getProfileByScienceId: (scienceId: string) =>
        `/profile_scienceid/${encodeURIComponent(scienceId)}`,
};

export class ScienceIdAPI {
    constructor(private api = baseApiClient) {}

    getProfileByScienceId = async (scienceId: string) => {
        const result: AxiosResponse<ProfileResponse> = await this.api.get(
            urls.getProfileByScienceId(scienceId)
        );
        return result.data;
    };
}

export const scienceIdApi = new ScienceIdAPI();
