import { visitCardApi } from '@/features/visit-card/api/visitCardApi';
import { queryKeys, useQuery } from '@/shared/hooks';

export const useProfileDetailQuery = (pnflCode: string | undefined) =>
    useQuery({
        queryKey: queryKeys.profile.detail(pnflCode ?? ''),
        queryFn: () => visitCardApi.getProfile(pnflCode!),
        enabled: !!pnflCode,
    });
