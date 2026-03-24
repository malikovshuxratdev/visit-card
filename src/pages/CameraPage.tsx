import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Button, Alert, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Camera, RotateCcw, Send, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetFaceIdMutate, useVisitCardMutate } from '../hooks/useVisitCard';
import { useFaceDetection } from '../hooks/useFaceDetection';

const { Title, Text } = Typography;

const REQUIRED_ALIGNMENT_FRAMES = 6;
const CAMERA_SIZE = 480;

const CameraPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const { mutate, isPending } = useVisitCardMutate();
    const { mutate: mutateFaceId, isPending: isPendingFaceId } =
        useGetFaceIdMutate();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState<string>('');
    const [capturedImageData, setCapturedImageData] = useState<string>('');
    const [capturedImageFile, setCapturedImageFile] = useState<File | null>(
        null
    );
    const [isFileReady, setIsFileReady] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null
    );

    const handleManualCapture = useCallback(() => {
        if (isCapturing) return;
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        setIsCapturing(true);
        let count = 3;
        setCountdown(count);
        countdownIntervalRef.current = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                captureImageRef.current?.();
                setIsCapturing(false);
                setCountdown(0);
            }
        }, 1000);
    }, [isCapturing]);

    const { state: faceState, isModelLoaded, loadError, resetConsecutive } =
        useFaceDetection(
            videoRef,
            stream,
            isCapturing,
            handleManualCapture
        );

    useEffect(() => {
        if (countdown > 0 && !faceState.isAligned) {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            setIsCapturing(false);
            setCountdown(0);
            resetConsecutive();
        }
    }, [countdown, faceState.isAligned, resetConsecutive]);

    const captureImage = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!video || !canvas || !ctx || video.readyState < 2) return;

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const size = Math.min(vw, vh);
        const sx = (vw - size) / 2;
        const sy = (vh - size) / 2;

        canvas.width = CAMERA_SIZE;
        canvas.height = CAMERA_SIZE;
        ctx.drawImage(
            video,
            sx, sy, size, size,
            0, 0, CAMERA_SIZE, CAMERA_SIZE
        );

        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImageData(imageData);
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    setCapturedImageFile(
                        new File([blob], 'captured-image.jpg', {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        })
                    );
                    setIsFileReady(true);
                    streamRef.current?.getTracks().forEach((t) => t.stop());
                }
            },
            'image/jpeg',
            0.95
        );
        setShowPreview(true);
    }, []);

    const captureImageRef = useRef(captureImage);
    captureImageRef.current = captureImage;

    useEffect(() => {
        startCamera();
        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    useEffect(() => {
        streamRef.current = stream;
        const video = videoRef.current;
        if (video && stream) {
            video.srcObject = stream;
            if (video.readyState < 2) {
                video.onloadedmetadata = () => video.play().catch(() => { });
            } else {
                video.play().catch(() => { });
            }
        }
        return () => {
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                },
            });
            setStream(mediaStream);
        } catch {
            setError(
                'Kameraga kirish mumkin emas. Iltimos, ruxsat berilganligini tekshiring.'
            );
        }
    };

    const handleSubmitImage = () => {
        if (!capturedImageFile || !isFileReady) return;
        if (id) {
            mutateFaceId({ image: capturedImageFile, pnfl_code: id });
        } else {
            mutate({ image: capturedImageFile });
        }
    };

    const handleRetakePhoto = async () => {
        setCapturedImageData('');
        setCapturedImageFile(null);
        setIsFileReady(false);
        setShowPreview(false);
        setIsCapturing(false);
        setCountdown(0);
        resetConsecutive();
        await startCamera();
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] p-4">
                <div className="max-w-2xl mx-auto w-full">
                    <Card className="glass-card border-0 shadow-xl">
                        <div className="text-center p-6">
                            <Alert
                                message="Kamera Ruxsati Xatosi"
                                description={error}
                                type="error"
                                showIcon
                                className="mb-4"
                            />
                            <Button
                                onClick={() => navigate('/')}
                                icon={<ArrowLeftOutlined />}
                                size="large"
                                className="h-12 px-6"
                            >
                                Orqaga Qaytish
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (showPreview && capturedImageData) {
        return (
            <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-lg flex flex-col items-center">
                    <Card className="glass-card border-0 shadow-xl w-full [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:items-center">
                        <div className="text-center mb-6 w-full">
                            <Title level={2}>Rasimni Tekshiring</Title>
                            <Text type="secondary" className="block mt-1">
                                Yuborishdan oldin rasm sizga mos kelishini tekshiring
                            </Text>
                        </div>
                        <div
                            className="flex justify-center mb-8 w-full"
                            style={{
                                width: `min(${CAMERA_SIZE}px, calc(100vw - 2rem))`,
                                aspectRatio: '1',
                            }}
                        >
                            <img
                                src={capturedImageData}
                                alt="Olingan rasm"
                                className="rounded-2xl shadow-xl w-full h-full object-cover mx-auto block"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="large"
                                onClick={() => navigate('/')}
                                icon={<X size={20} />}
                                className="h-12 px-6 gap-2"
                            >
                                Bekor Qilish
                            </Button>
                            <Button
                                size="large"
                                onClick={handleRetakePhoto}
                                icon={<RotateCcw size={20} />}
                                className="h-12 px-6 gap-2 border-amber-500 text-amber-600 hover:border-amber-600 hover:text-amber-700"
                                disabled={isPending || isPendingFaceId}
                            >
                                Qayta Olish
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleSubmitImage}
                                loading={isPending || isPendingFaceId}
                                icon={<Send size={20} />}
                                className="h-12 px-6 gap-2 bg-emerald-600 hover:bg-emerald-700"
                                disabled={!isFileReady}
                            >
                                {!isFileReady
                                    ? 'Tayyorlanmoqda...'
                                    : 'Rasimni Yuborish'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const progressPercent =
        (faceState.consecutiveGoodFrames / REQUIRED_ALIGNMENT_FRAMES) * 100;
    const isAligned = faceState.isAligned;
    const hasFace = faceState.isDetected;

    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg flex flex-col items-center">
                <Card className="glass-card border-0 shadow-xl overflow-hidden w-full [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:items-center">
                    <div className="text-center mb-6 w-full">
                        <Title level={2} className="!mb-2">
                            Yuzingizni Joylashtiring
                        </Title>
                        <Text type="secondary" className="text-sm block">
                            {loadError ? (
                                <span className="text-amber-600">{loadError}</span>
                            ) : !isModelLoaded ? (
                                'AI yuz skanerlash yuklanmoqda...'
                            ) : hasFace && isAligned ? (
                                <>
                                    ✅ Yuz joylashuvi yaxshi!{' '}
                                    {faceState.consecutiveGoodFrames >=
                                        REQUIRED_ALIGNMENT_FRAMES
                                        ? 'Rasmga olinadi...'
                                        : `Avtomatik rasmga olish uchun ${REQUIRED_ALIGNMENT_FRAMES - faceState.consecutiveGoodFrames} soniya kuting...`}
                                </>
                            ) : hasFace ? (
                                '↔️ Yuzingizni doira markaziga yaqinlashtiring'
                            ) : (
                                '👤 Yuzingizni doira ichiga joylashtiring'
                            )}
                        </Text>

                        {isModelLoaded && !loadError && hasFace && (
                            <div className="mt-4 max-w-sm mx-auto">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Joylashuv</span>
                                    <span>{Math.round(faceState.alignmentScore * 100)}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${isAligned
                                            ? 'bg-emerald-500'
                                            : 'bg-amber-500'
                                            }`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mb-6 px-2">
                        <div
                            className="camera-container relative rounded-2xl overflow-hidden bg-black shadow-2xl"
                            style={{
                                width: `min(${CAMERA_SIZE}px, calc(100vw - 2rem))`,
                                aspectRatio: '1',
                            }}
                        >
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{
                                    transform: 'scaleX(-1)',
                                    filter: 'brightness(1.05) contrast(1.05)',
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div
                                    className={`rounded-full border-4 transition-all duration-500 ${isAligned
                                        ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/30'
                                        : hasFace
                                            ? 'border-amber-400 bg-amber-500/10'
                                            : 'border-slate-400 bg-slate-500/10'
                                        }`}
                                    style={{
                                        width: 'min(280px, 55%)',
                                        aspectRatio: '1',
                                    }}
                                />
                            </div>
                            {countdown > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center text-5xl font-bold text-slate-800 shadow-2xl animate-pulse">
                                        {countdown}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            size="large"
                            onClick={() => navigate('/')}
                            icon={<X size={20} />}
                            className="h-12 px-6 gap-2"
                        >
                            Bekor Qilish
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleManualCapture}
                            icon={<Camera size={20} />}
                            disabled={isCapturing}
                            className="h-12 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isCapturing ? 'Rasmga Olinmoqda...' : 'Rasmga Olish'}
                        </Button>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                </Card>
            </div>
        </div>
    );
};

export default CameraPage;
