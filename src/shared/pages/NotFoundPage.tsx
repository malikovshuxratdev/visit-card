import { Button } from 'antd';
import { Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/path';
import { BrandBackground, StatusCard } from '@/shared/ui';

export default function NotFoundPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <BrandBackground />
            <StatusCard
                icon={<Compass size={30} />}
                title={t('pages.not-found.title')}
                description={t('pages.not-found.text')}
                actions={
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate(paths.HOME, { replace: true })}
                    >
                        {t('common.home')}
                    </Button>
                }
            />
        </main>
    );
}
