import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import innovationIcon from '@/assets/icons/innovation.svg';
import { SCIENCE_ID_URL } from '@/shared/constants';

export function NoScienceIdHint() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center sm:flex-row sm:text-left">
            <div className="relative shrink-0 rounded-xl bg-white p-2.5">
                <QRCodeSVG value={SCIENCE_ID_URL} size={104} level="M" />
                <img
                    src={innovationIcon}
                    alt=""
                    className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-0.5"
                />
            </div>
            <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-white">
                    {t('pages.home.no-id-title')}
                </h2>
                <p className="text-pretty text-sm leading-relaxed text-white/65">
                    {t('pages.home.no-id-text')}
                </p>
            </div>
        </div>
    );
}

export default NoScienceIdHint;
