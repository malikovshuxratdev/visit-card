import type { AxiosResponse } from 'axios';
import { baseApiClient } from '@/shared/api';
import type {
    RecognizeFaceBody,
    RecognizeFaceResponse,
    VerifyFaceBody,
    VerifyFaceResponse,
} from '@/features/face-id/types';

const urls = {
    recognizeFace: '/recognize_face',
    verifyFace: '/verify_face',
};

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export class FaceIdAPI {
    constructor(private api = baseApiClient) {}

    recognizeFace = async (body: RecognizeFaceBody) => {
        const formData = new FormData();
        formData.append('image', body.image, body.image.name);

        const result: AxiosResponse<RecognizeFaceResponse> =
            await this.api.post(urls.recognizeFace, formData, multipart);
        return result.data;
    };

    verifyFace = async (body: VerifyFaceBody) => {
        const formData = new FormData();
        formData.append('image', body.image, body.image.name);
        formData.append('pnfl_code', body.pnfl_code);

        const result: AxiosResponse<VerifyFaceResponse> = await this.api.post(
            urls.verifyFace,
            formData,
            multipart
        );
        return result.data;
    };
}

export const faceIdApi = new FaceIdAPI();
