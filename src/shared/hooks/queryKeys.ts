export const queryKeys = {
    profile: {
        root: ['profile'] as const,
        detail: (pnflCode: string) => ['profile', 'detail', pnflCode] as const,
    },
};
