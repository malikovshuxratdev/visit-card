import { useTranslation } from 'react-i18next';
import {
    FaceScanOption,
    NoScienceIdHint,
    ScienceIdForm,
} from '@/features/science-id/components';
import {
    CardBack,
    CardFront,
    CardPreview,
    SAMPLE_PROFILE,
} from '@/features/visit-card';
import { PageHeading, Panel } from '@/shared/ui';

function HomePage() {
    const { t } = useTranslation();

    return (
        <div className="grid animate-fade-up grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <Panel className="flex flex-col gap-8 lg:col-span-7 lg:p-10">
                <PageHeading
                    eyebrow={t('pages.home.eyebrow')}
                    title={t('pages.home.title')}
                    subtitle={t('pages.home.subtitle')}
                />
                <ScienceIdForm />
                <FaceScanOption />
                <NoScienceIdHint />
            </Panel>

            <Panel as="aside" className="flex flex-col gap-6 lg:col-span-5">
                <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white">
                        {t('pages.home.preview-title')}
                    </h2>
                    <p className="text-sm text-white/60">
                        {t('pages.home.preview-text')}
                    </p>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-6">
                    <CardPreview label={t('pages.generator.front')}>
                        <CardFront profile={SAMPLE_PROFILE} />
                    </CardPreview>
                    <CardPreview label={t('pages.generator.back')}>
                        <CardBack profile={SAMPLE_PROFILE} isSample />
                    </CardPreview>
                </div>
            </Panel>
        </div>
    );
}

export default HomePage;
