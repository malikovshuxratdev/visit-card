import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/api/authApi';
import { paths } from '@/routes/path';
import { useMutation } from '@/shared/hooks';
import {
    showErrorModal,
    showErrorModalFromApiError,
    TokenService,
} from '@/shared/utils';

export const useLoginMutation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            if (!data?.access_token) {
                showErrorModalFromApiError(null);
                return;
            }
            TokenService.setToken(data.access_token);
            navigate(paths.HOME, { replace: true });
        },
        onError: (error) => {
            const status = isAxiosError(error) ? error.response?.status : null;
            if (status === 400 || status === 401 || status === 422) {
                showErrorModal({
                    content: t('pages.login.invalid-credentials'),
                });
            } else {
                showErrorModalFromApiError(error);
            }
        },
    });
};
