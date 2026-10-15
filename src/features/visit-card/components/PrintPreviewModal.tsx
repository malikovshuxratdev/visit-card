import { useState } from 'react';
import { Button, Modal } from 'antd';
import { Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { prepareImageForPrint, printImages } from '@/features/visit-card/utils';
import { showErrorModal } from '@/shared/utils';

type PrintPreviewModalProps = {
    open: boolean;
    onClose: () => void;
    frontImage?: string;
    backImage?: string;
    onPrintStart: () => void;
};

export function PrintPreviewModal({
    open,
    onClose,
    frontImage,
    backImage,
    onPrintStart,
}: PrintPreviewModalProps) {
    const { t } = useTranslation();
    const [isPreparing, setIsPreparing] = useState(false);
    const images = [frontImage, backImage].filter(
        (src): src is string => !!src
    );

    const handlePrint = async () => {
        if (images.length === 0 || isPreparing) return;
        setIsPreparing(true);
        try {
            const printable = await Promise.all(
                images.map((src) => prepareImageForPrint(src))
            );
            await printImages(printable);
            onPrintStart();
        } catch (error) {
            console.error('Print failed:', error);
            showErrorModal({ content: t('pages.generator.export-failed') });
        } finally {
            setIsPreparing(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={isPreparing ? undefined : onClose}
            maskClosable={!isPreparing}
            closable={!isPreparing}
            footer={null}
            width={980}
            centered
            destroyOnHidden
            title={
                <div className="pr-8">
                    <h2 className="text-xl font-bold text-white">
                        {t('components.print-preview.title')}
                    </h2>
                    <p className="mt-1 text-sm font-normal text-white/60">
                        {t('components.print-preview.subtitle')}
                    </p>
                </div>
            }
        >
            <div className="flex flex-col gap-6 pt-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {images.map((src, index) => (
                        <figure key={index} className="flex flex-col gap-2">
                            <img
                                src={src}
                                alt=""
                                className="aspect-[450/280] w-full rounded-lg bg-white object-cover shadow-card"
                            />
                            <figcaption className="text-center text-sm text-white/60">
                                {index === 0
                                    ? t('pages.generator.front')
                                    : t('pages.generator.back')}
                            </figcaption>
                        </figure>
                    ))}
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button size="large" onClick={onClose} disabled={isPreparing}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        icon={<Printer size={18} />}
                        loading={isPreparing}
                        onClick={handlePrint}
                    >
                        {isPreparing
                            ? t('components.print-preview.preparing')
                            : t('components.print-preview.print')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default PrintPreviewModal;
