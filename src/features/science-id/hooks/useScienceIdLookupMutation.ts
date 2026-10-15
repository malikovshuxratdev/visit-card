import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { scienceIdApi } from '@/features/science-id/api/scienceIdApi';
import { paths } from '@/routes/path';
import { useMutation } from '@/shared/hooks';
import { showErrorModal, showErrorModalFromApiError } from '@/shared/utils';

export const useScienceIdLookupMutation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: scienceIdApi.getProfileByScienceId,
        onSuccess: (data) => {
            if (!data?.pnfl_code) {
                showErrorModal({
                    content: data?.message ?? t('pages.home.lookup-failed'),
                });
                return;
            }
            navigate(paths.camera(data.pnfl_code));
        },
        onError: showErrorModalFromApiError,
    });
};
