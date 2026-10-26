import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { Camera, CameraOff, RotateCcw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
    CameraViewport,
    CapturePreview,
    type GuideTone,
} from '@/features/face-id/components';
import {
    REQUIRED_CONSECUTIVE_FRAMES,
    useCamera,
    useFaceDetection,
    useRecognizeFaceMutation,
    useVerifyFaceMutation,
} from '@/features/face-id/hooks';
import type { CapturedPhoto } from '@/features/face-id/types';
import { paths } from '@/routes/path';
import { cn } from '@/shared/lib/utils';
import { PageHeading, Panel, StatusCard } from '@/shared/ui';

const COUNTDOWN_SECONDS = 3;
/** Output size of the captured square photo sent to the API. */
const CAPTURE_SIZE = 480;
const CAPTURE_QUALITY = 0.95;

type CountdownSource = 'auto' | 'manual';

const capturePhoto = (video: HTMLVideoElement): Promise<CapturedPhoto | null> =>
    new Promise((resolve) => {
        const { videoWidth: vw, videoHeight: vh } = video;
        if (video.readyState < 2 || vw === 0 || vh === 0) {
            resolve(null);
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = CAPTURE_SIZE;
        canvas.height = CAPTURE_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve(null);
            return;
        }

        // Centre square crop — the same area the viewport shows.
        const size = Math.min(vw, vh);
        ctx.drawImage(
            video,
            (vw - size) / 2,
            (vh - size) / 2,
            size,
            size,
            0,
            0,
            CAPTURE_SIZE,
            CAPTURE_SIZE
        );

        const dataUrl = canvas.toDataURL('image/jpeg', CAPTURE_QUALITY);
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    resolve(null);
                    return;
                }
                resolve({
                    dataUrl,
                    file: new File([blob], 'captured-image.jpg', {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    }),
                });
            },
            'image/jpeg',
            CAPTURE_QUALITY
        );
    });

function CameraPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id: pnflCode } = useParams<{ id?: string }>();
    const videoRef = useRef<HTMLVideoElement>(null);

    const { stream, error: cameraError, start, stop } = useCamera();
    const recognize = useRecognizeFaceMutation();
    const verify = useVerifyFaceMutation();
    const isSubmitting = recognize.isPending || verify.isPending;
    // With a PNFL (came from Science ID) the face is verified against that
    // profile; without one the person is looked up by face only.
    const mode = pnflCode ? 'verify' : 'recognize';

    const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
    const [countdown, setCountdown] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const sourceRef = useRef<CountdownSource | null>(null);
    const isTakingRef = useRef(false);

    const clearCountdown = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        sourceRef.current = null;
        setCountdown(0);
    }, []);

    const takePhoto = useCallback(async () => {
        const video = videoRef.current;
        if (!video || isTakingRef.current) return;
        isTakingRef.current = true;
        try {
            const captured = await capturePhoto(video);
            if (!captured) return;
            setPhoto(captured);
            stop();
        } finally {
            isTakingRef.current = false;
        }
    }, [stop]);

    const startCountdown = useCallback(
        (source: CountdownSource) => {
            if (timerRef.current || isTakingRef.current) return;
            sourceRef.current = source;
            let remaining = COUNTDOWN_SECONDS;
            setCountdown(remaining);
            timerRef.current = setInterval(() => {
                remaining -= 1;
                if (remaining > 0) {
                    setCountdown(remaining);
                    return;
                }
                clearCountdown();
                void takePhoto();
            }, 1000);
        },
        [clearCountdown, takePhoto]
    );

    const isCountingDown = countdown > 0;
    const {
        state: face,
        isModelLoaded,
        loadFailed,
        resetConsecutive,
    } = useFaceDetection(
        videoRef,
        stream,
        isCountingDown || photo !== null,
        () => startCountdown('auto')
    );

    // An auto-started countdown is cancelled when the face leaves the guide;
    // a manual one (button press) always completes.
    useEffect(() => {
        if (isCountingDown && sourceRef.current === 'auto' && !face.isAligned) {
            clearCountdown();
            resetConsecutive();
        }
    }, [isCountingDown, face.isAligned, clearCountdown, resetConsecutive]);

    useEffect(
        () => () => {
            if (timerRef.current) clearInterval(timerRef.current);
        },
        []
    );

    const goHome = () => navigate(paths.HOME);

    const handleRetake = () => {
        clearCountdown();
        resetConsecutive();
        setPhoto(null);
        void start();
    };

    const handleSubmit = () => {
        if (!photo || isSubmitting) return;
        if (pnflCode) {
            verify.mutate({ image: photo.file, pnfl_code: pnflCode });
        } else {
            recognize.mutate({ image: photo.file });
        }
    };

    if (cameraError) {
        return (
            <div className="flex min-h-[60vh] items-center">
                <StatusCard
                    tone="error"
                    icon={<CameraOff size={30} />}
                    title={t('pages.camera.errors.title')}
                    description={t(`pages.camera.errors.${cameraError}`)}
                    actions={
                        <>
                            <Button size="large" onClick={goHome}>
                                {t('common.home')}
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                icon={<RotateCcw size={18} />}
                                onClick={() => void start()}
                            >
                                {t('common.retry')}
                            </Button>
                        </>
                    }
                />
            </div>
        );
    }

    if (photo) {
        return (
            <CapturePreview
                photo={photo}
                eyebrow={t(`pages.camera.${mode}.eyebrow`)}
                submitLabel={t(`pages.camera.${mode}.submit`)}
                submittingLabel={t(`pages.camera.${mode}.submitting`)}
                isSubmitting={isSubmitting}
                onCancel={goHome}
                onRetake={handleRetake}
                onSubmit={handleSubmit}
            />
        );
    }

    const tone: GuideTone = face.isAligned
        ? 'aligned'
        : face.isDetected
          ? 'adjust'
          : 'idle';

    const status = (() => {
        if (isCountingDown) return t('pages.camera.capturing');
        if (loadFailed) return t('pages.camera.model-failed');
        if (!isModelLoaded || !stream) return t('pages.camera.model-loading');
        if (face.faceCount > 1) return t('pages.camera.multiple-faces');
        if (face.isAligned) return t('pages.camera.hold-still');
        if (face.isDetected) return t('pages.camera.adjust');
        return t('pages.camera.no-face');
    })();

    const progress = Math.min(
        (face.consecutiveGoodFrames / REQUIRED_CONSECUTIVE_FRAMES) * 100,
        100
    );
    const showProgress = isModelLoaded && !loadFailed && face.isDetected;

    return (
        <Panel className="mx-auto flex w-full max-w-xl animate-fade-up flex-col gap-6">
            <PageHeading
                align="center"
                eyebrow={t(`pages.camera.${mode}.eyebrow`)}
                title={t(`pages.camera.${mode}.title`)}
                subtitle={t(`pages.camera.${mode}.subtitle`)}
            />

            <CameraViewport
                videoRef={videoRef}
                stream={stream}
                tone={tone}
                countdown={countdown}
                isScanning={isModelLoaded && !face.isDetected && !isCountingDown}
            />

            <div className="flex flex-col items-center gap-3">
                <p
                    aria-live="polite"
                    className={cn(
                        'min-h-[1.75rem] text-center text-lg font-medium',
                        loadFailed
                            ? 'text-amber-300'
                            : face.isAligned
                              ? 'text-brand-300'
                              : 'text-white/85'
                    )}
                >
                    {status}
                </p>

                <div
                    className={cn(
                        'w-full max-w-sm transition-opacity',
                        showProgress ? 'opacity-100' : 'opacity-0'
                    )}
                    aria-hidden={!showProgress}
                >
                    <div className="mb-1.5 flex justify-between text-xs font-medium text-white/55">
                        <span>{t('pages.camera.alignment')}</span>
                        <span className="tabular-nums">
                            {Math.round(face.alignmentScore * 100)}%
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                            className={cn(
                                'h-full rounded-full transition-[width,background-color] duration-300',
                                face.isAligned ? 'bg-brand-400' : 'bg-amber-400'
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button size="large" icon={<X size={18} />} onClick={goHome}>
                    {t('common.cancel')}
                </Button>
                <Button
                    type="primary"
                    size="large"
                    icon={<Camera size={18} />}
                    disabled={!stream || isCountingDown}
                    onClick={() => startCountdown('manual')}
                >
                    {isCountingDown
                        ? t('pages.camera.capturing')
                        : t('pages.camera.capture')}
                </Button>
            </div>
        </Panel>
    );
}

export default CameraPage;
