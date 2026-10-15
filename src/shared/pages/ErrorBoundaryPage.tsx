import { Button } from 'antd';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';
import { paths } from '@/routes/path';
import { BrandBackground, StatusCard } from '@/shared/ui';

export default function ErrorBoundaryPage() {
    const { t } = useTranslation();
    const error = useRouteError();

    if (import.meta.env.DEV) {
        console.error(error);
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <BrandBackground />
            <StatusCard
                tone="error"
                icon={<AlertTriangle size={30} />}
                title={t('pages.error-boundary.title')}
                description={t('pages.error-boundary.text')}
                actions={
                    <>
                        <Button
                            size="large"
                            onClick={() => window.location.assign(paths.HOME)}
                        >
                            {t('common.home')}
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => window.location.reload()}
                        >
                            {t('pages.error-boundary.reload')}
                        </Button>
                    </>
                }
            />
        </main>
    );
}
