import { AxiosResponse } from 'axios';
import {
    ProfileResponseType,
    VisitCardRequestType,
    VisitCardResponseType,
} from '../../types/visit-card';
import { baseApiClient } from '../baseClient';

const urls = {
    getVisitCard: '/recognize_face',
    getUserData: (pnfl_code: string) => `/profile/${pnfl_code}`,
};

export class VisitCardAPI {
    constructor(private api = baseApiClient) {}

    getVisitCard = async (body: VisitCardRequestType) => {
        const formData = new FormData();
        formData.append('image', body.image, 'captured-image.jpg');

        const result: AxiosResponse<VisitCardResponseType> =
            await this.api.post(urls.getVisitCard, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        return result.data;
    };

    getUserData = async (pnfl_code: string) => {
        const result: AxiosResponse<ProfileResponseType> = await this.api.get(
            urls.getUserData(pnfl_code)
        );
        return result.data;
    };
}

export const visitCardApi = new VisitCardAPI();
