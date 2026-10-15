import { useEffect, type ReactNode } from 'react';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { registerModalApi } from '@/shared/utils/modalHolder';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 60_000,
            retry: 1,
        },
        mutations: { retry: 0 },
    },
});

const antdTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: '#039855',
        colorInfo: '#38bdf8',
        colorBgBase: '#050b18',
        colorBgContainer: '#0f1d33',
        colorBgElevated: '#0f1d33',
        colorBorder: 'rgba(255, 255, 255, 0.16)',
        colorBorderSecondary: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        borderRadiusLG: 16,
        controlHeightLG: 52,
        fontSizeLG: 17,
        fontFamily:
            "Montserrat, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
        Button: {
            fontWeight: 600,
            primaryShadow: 'none',
            defaultShadow: 'none',
        },
        Modal: {
            contentBg: '#0f1d33',
            headerBg: '#0f1d33',
        },
    },
};

/** Exposes the themed modal API to non-React code (see showErrorModal). */
function ModalApiBridge() {
    const { modal } = AntApp.useApp();
    useEffect(() => {
        registerModalApi(modal);
    }, [modal]);
    return null;
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <I18nextProvider i18n={i18n}>
            <ConfigProvider theme={antdTheme}>
                <AntApp>
                    <ModalApiBridge />
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </AntApp>
            </ConfigProvider>
        </I18nextProvider>
    );
}

export default Providers;
