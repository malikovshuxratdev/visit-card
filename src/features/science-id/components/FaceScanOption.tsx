import { Button } from 'antd';
import { ArrowRight, ScanFace } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/path';

/** Alternative entry: find the visitor by face only, without a Science ID. */
export function FaceScanOption() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-5">
            <div
                className="flex items-center gap-4 text-sm font-medium uppercase tracking-[0.14em] text-white/45"
                aria-hidden
            >
                <span className="h-px flex-1 bg-white/10" />
                {t('pages.home.or')}
                <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex flex-col items-center gap-5 rounded-2xl border border-scan/25 bg-scan/[0.06] p-5 text-center sm:flex-row sm:text-left">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-scan/15 text-scan ring-1 ring-scan/30">
                    <ScanFace size={34} aria-hidden />
                </span>
                <div className="flex-1 space-y-1.5">
                    <h2 className="text-lg font-bold text-white">
                        {t('pages.home.face-scan-title')}
                    </h2>
                    <p className="text-pretty text-sm leading-relaxed text-white/65">
                        {t('pages.home.face-scan-text')}
                    </p>
                </div>
                <Button
                    size="large"
                    icon={<ArrowRight size={20} />}
                    iconPosition="end"
                    onClick={() => navigate(paths.camera())}
                    className="!h-14 w-full shrink-0 sm:w-auto"
                >
                    {t('pages.home.face-scan-submit')}
                </Button>
            </div>
        </div>
    );
}

export default FaceScanOption;
