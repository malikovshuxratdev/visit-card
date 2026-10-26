import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { faceIdApi } from '@/features/face-id/api/faceIdApi';
import { paths } from '@/routes/path';
import { useMutation } from '@/shared/hooks';
import { showErrorModal, showErrorModalFromApiError } from '@/shared/utils';

/** Finds a person by face only (no Science ID entered). */
export const useRecognizeFaceMutation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: faceIdApi.recognizeFace,
        onSuccess: (data) => {
            if (!data?.pnfl_code) {
                showErrorModal({
                    title: t('pages.camera.not-recognized-title'),
                    content: data?.message || t('pages.camera.not-recognized'),
                });
                return;
            }
            navigate(paths.generator(data.pnfl_code));
        },
        onError: showErrorModalFromApiError,
    });
};

/** Confirms the captured face matches the Science ID profile photo. */
export const useVerifyFaceMutation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: faceIdApi.verifyFace,
        onSuccess: (data, variables) => {
            if (!data?.is_match) {
                showErrorModal({
                    title: t('pages.camera.no-match-title'),
                    content: t('pages.camera.no-match'),
                });
                return;
            }
            navigate(paths.generator(data.pnfl_code || variables.pnfl_code));
        },
        onError: showErrorModalFromApiError,
    });
};
