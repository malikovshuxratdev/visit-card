import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import Lottie from 'lottie-react';
import { useTranslation } from 'react-i18next';
import printingAnimation from '@/assets/animations/printing.json';
import { PRINTING_REDIRECT_SECONDS } from '@/features/visit-card/constants';

type PrintingOverlayProps = {
    onDone: () => void;
};

/** Full-screen "printing" state that returns home after a countdown. */
export function PrintingOverlay({ onDone }: PrintingOverlayProps) {
    const { t } = useTranslation();
    const [secondsLeft, setSecondsLeft] = useState(PRINTING_REDIRECT_SECONDS);
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((value) => Math.max(value - 1, 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (secondsLeft === 0) onDoneRef.current();
    }, [secondsLeft]);

    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-6 backdrop-blur-md"
        >
            <div className="flex max-w-md animate-fade-up flex-col items-center gap-6 text-center">
                <div className="h-56 w-56 rounded-full bg-white p-6 shadow-panel sm:h-64 sm:w-64">
                    <Lottie
                        animationData={printingAnimation}
                        loop
                        className="h-full w-full"
                    />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                        {t('components.printing.title')}
                    </h2>
                    <p className="text-base text-white/70">
                        {t('components.printing.text')}
                    </p>
                    <p className="text-sm tabular-nums text-white/50">
                        {t('components.printing.auto-return', {
                            seconds: secondsLeft,
                        })}
                    </p>
                </div>
                <Button type="primary" size="large" onClick={onDone}>
                    {t('components.printing.done')}
                </Button>
            </div>
        </div>
    );
}

export default PrintingOverlay;
