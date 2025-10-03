import { message } from 'antd';
import { visitCardApi } from '../api/requests/visitCardApi';
import { useMutation } from './useQuery';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

export const useVisitCardMutate = () => {
    const navigate = useNavigate();

    const mutate = useMutation({
        mutationFn: visitCardApi.getVisitCard,
        onSuccess: (data) => {
            if (data.pnfl_code === null) {
                message.error(data.message);
            } else {
                navigate(`/generator/${data.pnfl_code}`);
            }
        },
        onError: (error) => {
            console.log(error);
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
