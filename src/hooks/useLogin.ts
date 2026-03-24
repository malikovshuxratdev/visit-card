import { loginApi } from '../api/requests/loginApi';
import { useMutation } from './useQuery';
import { TokenService } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { showErrorModal } from '../utils/showErrorModal';

export const useLoginMutate = () => {
    const navigate = useNavigate();

    const mutate = useMutation({
        mutationFn: loginApi.login,
        onSuccess: (data) => {
            TokenService.setToken(data.access_token);
            if (data.access_token) {
                navigate('/');
            }
        },
        onError: () => {
            showErrorModal({
                content:
                    "Login yoki parol noto'g'ri. Qaytadan urinib ko'ring.",
            });
        },
    });
    return mutate;
};
