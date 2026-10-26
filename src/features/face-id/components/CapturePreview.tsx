import { Button } from 'antd';
import { RotateCcw, ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CapturedPhoto } from '@/features/face-id/types';
import { PageHeading, Panel } from '@/shared/ui';

type CapturePreviewProps = {
    photo: CapturedPhoto;
    eyebrow: string;
    submitLabel: string;
    submittingLabel: string;
    isSubmitting: boolean;
    onCancel: () => void;
    onRetake: () => void;
    onSubmit: () => void;
};

export function CapturePreview({
    photo,
    eyebrow,
    submitLabel,
    submittingLabel,
    isSubmitting,
    onCancel,
    onRetake,
    onSubmit,
}: CapturePreviewProps) {
    const { t } = useTranslation();

    return (
        <Panel className="mx-auto flex w-full max-w-xl animate-fade-up flex-col gap-6">
            <PageHeading
                align="center"
                eyebrow={eyebrow}
                title={t('pages.camera.preview-title')}
                subtitle={t('pages.camera.preview-subtitle')}
            />

            <img
                src={photo.dataUrl}
                alt={t('pages.camera.captured-alt')}
                className="mx-auto aspect-square w-full max-w-[480px] -scale-x-100 rounded-3xl object-cover ring-1 ring-white/10"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button
                    size="large"
                    icon={<X size={18} />}
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    size="large"
                    icon={<RotateCcw size={18} />}
                    onClick={onRetake}
                    disabled={isSubmitting}
                >
                    {t('pages.camera.retake')}
                </Button>
                <Button
                    type="primary"
                    size="large"
                    icon={<ShieldCheck size={18} />}
                    loading={isSubmitting}
                    onClick={onSubmit}
                >
                    {isSubmitting ? submittingLabel : submitLabel}
                </Button>
            </div>
        </Panel>
    );
}

export default CapturePreview;
