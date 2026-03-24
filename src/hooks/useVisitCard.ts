import { visitCardApi } from '../api/requests/visitCardApi';
import { useMutation } from './useQuery';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    showErrorModal,
    showErrorModalFromApiError,
} from '../utils/showErrorModal';

export const useVisitCardMutate = () => {
    const navigate = useNavigate();

    const mutate = useMutation({
        mutationFn: visitCardApi.getVisitCard,
        onSuccess: (data) => {
            if (data.pnfl_code === null) {
                showErrorModal({ content: data.message });
            } else {
                navigate(`/generator/${data.pnfl_code}`);
            }
        },
        onError: (error: unknown) => {
            showErrorModalFromApiError(error);
        },
    });
    return mutate;
};

export const useGetScienceIdQuery = () => {
    const mutate = useMutation({
        mutationFn: visitCardApi.getScienceId,
        onSuccess: () => {},
        onError: (error: unknown) => {
            showErrorModalFromApiError(error);
        },
    });
    return mutate;
};

export const useGetUserQuery = (pnfl_code: string) => {
    return useQuery({
        queryKey: ['user', pnfl_code],
        queryFn: () => visitCardApi.getUserData(pnfl_code),
    });
};

export const useGetFaceIdMutate = () => {
    const navigate = useNavigate();

    const mutate = useMutation({
        mutationFn: visitCardApi.getFaceId,
        onSuccess: (data) => {
            if (data?.is_match === false) {
                showErrorModal({
                    title: 'Rasm mos emas',
                    content:
                        'Yuborilgan rasm Science ID platformasidagi surat bilan mos kelmadi. Iltimos, qayta urinib ko‘ring.',
                });
            } else {
                navigate(`/generator/${data.pnfl_code}`);
            }
        },
        onError: (error: unknown) => {
            showErrorModalFromApiError(error);
        },
    });
    return mutate;
};
