import { useRef, useState } from 'react';
import { Button } from 'antd';
import { ArrowLeft, Printer, UserX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import backCardImage from '@/assets/images/backImage.png';
import frontCardImage from '@/assets/images/frontImage.png';
import {
    CardBack,
    CardFront,
    CardPreview,
    PrintingOverlay,
    PrintPreviewModal,
} from '@/features/visit-card/components';
import {
    useImagesReady,
    useProfileDetailQuery,
} from '@/features/visit-card/hooks';
import { exportCardImage } from '@/features/visit-card/utils';
import { paths } from '@/routes/path';
import { PageHeading, PageLoader, StatusCard } from '@/shared/ui';
import { getApiErrorMessage, showErrorModal } from '@/shared/utils';

const CARD_ASSETS = [frontCardImage, backCardImage];

function GeneratorPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, isError, error, refetch } =
        useProfileDetailQuery(id);
    const assetsReady = useImagesReady(CARD_ASSETS);

    const frontCardRef = useRef<HTMLDivElement>(null);
    const backCardRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<{ front?: string; back?: string }>(
        {}
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    const goHome = () => navigate(paths.HOME);

    const handleOpenPrintPreview = async () => {
        if (!frontCardRef.current || !backCardRef.current) return;
        setIsExporting(true);
        try {
            const front = await exportCardImage(frontCardRef.current);
            const back = await exportCardImage(backCardRef.current);
            setImages({ front, back });
            setIsModalOpen(true);
        } catch (exportError) {
            console.error('Card export failed:', exportError);
            showErrorModal({ content: t('pages.generator.export-failed') });
        } finally {
            setIsExporting(false);
        }
    };

    const handlePrintStart = () => {
        setIsModalOpen(false);
        setIsPrinting(true);
    };

    if (isLoading || !assetsReady) {
        return <PageLoader label={t('pages.generator.loading')} />;
    }

    const profile = data?.profile_found ? data.profile : null;

    if (isError || !profile) {
        return (
            <div className="flex min-h-[60vh] items-center">
                <StatusCard
                    tone="warning"
                    icon={<UserX size={30} />}
                    title={t('pages.generator.not-found-title')}
                    description={
                        isError
                            ? getApiErrorMessage(error)
                            : (data?.message ?? t('pages.generator.not-found'))
                    }
                    actions={
                        <>
                            <Button
                                size="large"
                                icon={<ArrowLeft size={18} />}
                                onClick={goHome}
                            >
                                {t('common.home')}
                            </Button>
                            {isError && (
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => refetch()}
                                >
                                    {t('common.retry')}
                                </Button>
                            )}
                        </>
                    }
                />
            </div>
        );
    }

    return (
        <div className="flex animate-fade-up flex-col gap-8 lg:gap-10">
            <PageHeading
                align="center"
                eyebrow={t('pages.generator.eyebrow')}
                title={t('pages.generator.title')}
                subtitle={t('pages.generator.subtitle')}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                <CardPreview label={t('pages.generator.front')} maxScale={1.3}>
                    <CardFront ref={frontCardRef} profile={profile} />
                </CardPreview>
                <CardPreview label={t('pages.generator.back')} maxScale={1.3}>
                    <CardBack ref={backCardRef} profile={profile} />
                </CardPreview>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-4">
                <Button
                    size="large"
                    icon={<ArrowLeft size={18} />}
                    onClick={goHome}
                    className="sm:min-w-44"
                >
                    {t('common.back')}
                </Button>
                <Button
                    type="primary"
                    size="large"
                    icon={<Printer size={18} />}
                    loading={isExporting}
                    onClick={handleOpenPrintPreview}
                    className="sm:min-w-56"
                >
                    {isExporting
                        ? t('pages.generator.preparing')
                        : t('pages.generator.print')}
                </Button>
            </div>

            <PrintPreviewModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                frontImage={images.front}
                backImage={images.back}
                onPrintStart={handlePrintStart}
            />

            {isPrinting && <PrintingOverlay onDone={goHome} />}
        </div>
    );
}

export default GeneratorPage;
