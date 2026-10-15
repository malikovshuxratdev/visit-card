import { useEffect, type RefObject } from 'react';
import { cn } from '@/shared/lib/utils';

export type GuideTone = 'idle' | 'adjust' | 'aligned';

const guideStyles: Record<GuideTone, string> = {
    idle: 'border-scan/80',
    adjust: 'border-amber-400',
    aligned: 'border-brand-400 shadow-[0_0_40px_rgba(50,213,131,0.45)]',
};

type CameraViewportProps = {
    videoRef: RefObject<HTMLVideoElement>;
    stream: MediaStream | null;
    tone: GuideTone;
    countdown: number;
    isScanning: boolean;
};

/** Mirrored square camera feed with a circular face guide. */
export function CameraViewport({
    videoRef,
    stream,
    tone,
    countdown,
    isScanning,
}: CameraViewportProps) {
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        if (stream) video.play().catch(() => undefined);
    }, [stream, videoRef]);

    return (
        <div className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-3xl bg-ink-950 ring-1 ring-white/10">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full -scale-x-100 object-cover"
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                    className={cn(
                        'relative aspect-square w-[58%] overflow-hidden rounded-full border-4 shadow-[0_0_0_9999px_rgba(5,11,24,0.55)] transition-[border-color,box-shadow] duration-300',
                        guideStyles[tone]
                    )}
                >
                    {isScanning && (
                        <div className="absolute inset-x-0 top-0 h-full animate-scan-line bg-gradient-to-b from-transparent via-scan/25 to-transparent" />
                    )}
                </div>
            </div>

            {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        key={countdown}
                        className="flex h-24 w-24 animate-fade-up items-center justify-center rounded-full bg-white/95 text-5xl font-bold tabular-nums text-ink-950 shadow-panel"
                        aria-live="assertive"
                    >
                        {countdown}
                    </span>
                </div>
            )}
        </div>
    );
}

export default CameraViewport;
