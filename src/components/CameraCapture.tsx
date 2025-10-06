import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Alert, Space, Typography } from 'antd';
import { CameraOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CameraCaptureProps {
    onImageCaptured: (imageData: string) => void;
    onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
    onImageCaptured,
    onCancel,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const detectionRafRef = useRef<number | null>(null);
    const detectorRef = useRef<any>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [faceDetected, setFaceDetected] = useState(false);
    const [error, setError] = useState<string>('');
    const [capturedImageData, setCapturedImageData] = useState<string>('');
    const [showPreview, setShowPreview] = useState(false);
    const [faceDetectionCount, setFaceDetectionCount] = useState(0);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            if (detectionRafRef.current) {
                cancelAnimationFrame(detectionRafRef.current);
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            // Basic feature checks
            if (
                typeof navigator === 'undefined' ||
                !('mediaDevices' in navigator)
            ) {
                setError(
                    'Ushbu brauzer kamerani qo‘llab-quvvatlamaydi. Iltimos, Chrome/Edge yangilangan versiyasidan foydalaning.'
                );
                return;
            }

            // Secure context check (required by Chromium on Windows)
            const isSecure =
                ((window as any).isSecureContext ??
                    location.protocol === 'https:') ||
                location.hostname === 'localhost';
            if (!isSecure) {
                setError(
                    'Kamera faqat xavfsiz muhitda ishlaydi (https yoki localhost). Iltimos, loyihani `https` orqali ishga tushiring.'
                );
                return;
            }

            // Try user-facing camera first; on Windows external cams may ignore facingMode
            const preferredConstraints: MediaStreamConstraints = {
                video: {
                    facingMode: { ideal: 'user' } as any,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            let mediaStream: MediaStream | null = null;

            try {
                mediaStream = await navigator.mediaDevices.getUserMedia(
                    preferredConstraints
                );
            } catch {
                // Fallback: relax constraints (some Windows drivers fail with facingMode/ideal sizes)
                try {
                    mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });
                } catch (e) {
                    throw e;
                }
            }

            if (!mediaStream) {
                setError(
                    'Kamerani ishga tushirish imkonsiz. Tizimdagi boshqa ilovalar kamerani band qilmaganini tekshiring.'
                );
                return;
            }

            setStream(mediaStream);
            const video = videoRef.current;
            if (video) {
                video.srcObject = mediaStream;
                // Wait for metadata to ensure videoWidth/videoHeight are available, then play
                const onLoadedMeta = () => {
                    // Some Windows/Edge builds require explicit play()
                    video.play().catch(() => {
                        /* ignore autoplay errors since muted=true */
                    });
                    setupFaceDetector();
                    video.removeEventListener('loadedmetadata', onLoadedMeta);
                };
                video.addEventListener('loadedmetadata', onLoadedMeta);
            }
        } catch (err: any) {
            // Map common Windows/Chromium errors to helpful messages
            const name = err?.name || '';
            if (
                name === 'NotAllowedError' ||
                name === 'PermissionDeniedError'
            ) {
                setError(
                    'Kamera ruxsati rad etildi. Brauzer sozlamalaridan ruxsat bering va sahifani yangilang.'
                );
                return;
            }
            if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
                setError(
                    'Hech qanday kamera topilmadi. Qurilmani ulang yoki boshqa kamerani tanlang.'
                );
                return;
            }
            if (name === 'NotReadableError' || name === 'TrackStartError') {
                setError(
                    'Kameradan foydalanib bo‘lmadi. Kamera boshqa dastur tomonidan band bo‘lishi mumkin.'
                );
                return;
            }
            if (
                name === 'OverconstrainedError' ||
                name === 'ConstraintNotSatisfiedError'
            ) {
                setError(
                    'Kamera sozlamalari mos kelmadi. Iltimos, boshqa kamerani tanlab ko‘ring.'
                );
                return;
            }
            setError(
                'Kamerani ishga tushirishda xatolik yuz berdi. Brauzer ruxsatlari va HTTPS muhitini tekshiring.'
            );
        }
    };

    const isFaceDetectorSupported = () => {
        return typeof window !== 'undefined' && (window as any).FaceDetector;
    };

    const setupFaceDetector = () => {
        const video = videoRef.current;
        if (!video) return;

        // Prepare offscreen canvas for detection snapshots
        if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
        }

        if (isFaceDetectorSupported()) {
            try {
                if (!detectorRef.current) {
                    const FaceDetectorCtor = (window as any).FaceDetector;
                    detectorRef.current = new FaceDetectorCtor({
                        fastMode: true,
                        maxDetectedFaces: 1,
                    });
                }
            } catch {
                detectorRef.current = null;
            }
        }

        // Start detection loop
        startDetectionLoop();
    };

    const startDetectionLoop = () => {
        const video = videoRef.current;
        const offscreen = offscreenCanvasRef.current;
        if (!video || !offscreen) return;

        const detect = async () => {
            if (!videoRef.current) return;

            const hasData =
                video.readyState >= 2 &&
                video.videoWidth > 0 &&
                video.videoHeight > 0;

            if (hasData && !isCapturing) {
                const vw = video.videoWidth;
                const vh = video.videoHeight;
                offscreen.width = Math.min(512, vw);
                offscreen.height = Math.floor((offscreen.width / vw) * vh);
                const ctx = offscreen.getContext('2d', {
                    willReadFrequently: true,
                });
                if (ctx) {
                    ctx.drawImage(
                        video,
                        0,
                        0,
                        offscreen.width,
                        offscreen.height
                    );

                    let detected = false;
                    try {
                        if (detectorRef.current) {
                            const faces = await detectorRef.current.detect(
                                offscreen
                            );
                            if (faces && faces.length > 0) {
                                // Basic centeredness check relative to a circular guide (~square center)
                                const face = faces[0].boundingBox;
                                const cx = face.x + face.width / 2;
                                const cy = face.y + face.height / 2;
                                const centerX = offscreen.width / 2;
                                const centerY = offscreen.height / 2;
                                const dx = cx - centerX;
                                const dy = cy - centerY;
                                const distance = Math.sqrt(dx * dx + dy * dy);
                                const radius =
                                    Math.min(
                                        offscreen.width,
                                        offscreen.height
                                    ) * 0.22; // ~align with 300px ring
                                const sizeOk =
                                    face.width > offscreen.width * 0.22 &&
                                    face.height > offscreen.height * 0.22;
                                detected = distance < radius && sizeOk;
                            }
                        } else {
                            // Fallback heuristic: look for sufficient detail/contrast in the center region
                            const regionSize = Math.floor(
                                Math.min(offscreen.width, offscreen.height) *
                                    0.4
                            );
                            const sx = Math.floor(
                                (offscreen.width - regionSize) / 2
                            );
                            const sy = Math.floor(
                                (offscreen.height - regionSize) / 2
                            );
                            const data = ctx.getImageData(
                                sx,
                                sy,
                                regionSize,
                                regionSize
                            ).data;
                            let sum = 0;
                            let sumSq = 0;
                            const step = 4 * 4; // sample every 4px
                            let count = 0;
                            for (let i = 0; i < data.length; i += step) {
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];
                                const l = 0.299 * r + 0.587 * g + 0.114 * b;
                                sum += l;
                                sumSq += l * l;
                                count++;
                            }
                            const mean = sum / Math.max(1, count);
                            const variance =
                                sumSq / Math.max(1, count) - mean * mean;
                            // Heuristic: enough variance implies presence of detailed subject (likely a face) under the guide
                            detected = variance > 900; // tuned empirically
                        }
                    } catch {
                        // ignore detection errors per frame
                    }

                    setFaceDetected(detected);
                    if (detected) {
                        setFaceDetectionCount((prev) => prev + 1);
                        if (faceDetectionCount >= 2 && !isCapturing) {
                            handleManualCapture();
                        }
                    } else {
                        setFaceDetectionCount(0);
                    }
                }
            }

            detectionRafRef.current = requestAnimationFrame(detect);
        };

        if (detectionRafRef.current)
            cancelAnimationFrame(detectionRafRef.current);
        detectionRafRef.current = requestAnimationFrame(detect);
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: true });

        if (!context) return;

        const performDraw = () => {
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            if (videoWidth === 0 || videoHeight === 0) {
                return;
            }

            const aspectRatio = videoWidth / videoHeight;

            const maxWidth = 800; // allow higher capture res on large screens
            const maxHeight = 800;

            let canvasWidth = maxWidth;
            let canvasHeight = maxHeight;

            if (aspectRatio > maxWidth / maxHeight) {
                canvasHeight = maxWidth / aspectRatio;
            } else {
                canvasWidth = maxHeight * aspectRatio;
            }

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // Ensure we clear any prior pixels to avoid black backgrounds
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.imageSmoothingEnabled = true;
            context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
            // Export as PNG to preserve transparency and avoid black fill
            const imageData = canvas.toDataURL('image/png');

            setCapturedImageData(imageData);
            setShowPreview(true);

            // Stop tracks AFTER drawing to avoid black frames on some Windows drivers
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };

        // Ensure we have current frame data before drawing
        const hasData =
            video.readyState >= 2 &&
            video.videoWidth > 0 &&
            video.videoHeight > 0;
        if (!hasData) {
            const onLoaded = () => {
                video.removeEventListener('loadeddata', onLoaded);
                // Draw on next animation frame to ensure paint
                requestAnimationFrame(performDraw);
            };
            video.addEventListener('loadeddata', onLoaded);
            video.play().catch(() => {});
            return;
        }

        // Draw on next frame for consistency
        requestAnimationFrame(performDraw);
    };

    const handleSubmitImage = () => {
        onImageCaptured(capturedImageData);
    };

    const handleRetakePhoto = async () => {
        setCapturedImageData('');
        setShowPreview(false);
        setIsCapturing(false);
        setCountdown(0);
        setFaceDetectionCount(0);
        setFaceDetected(false);
        if (detectionRafRef.current) {
            cancelAnimationFrame(detectionRafRef.current);
            detectionRafRef.current = null;
        }
        await startCamera();
    };

    const handleManualCapture = () => {
        if (isCapturing) return;

        setIsCapturing(true);
        let count = 3;
        setCountdown(count);

        const countdownInterval = setInterval(() => {
            count--;
            setCountdown(count);

            if (count === 0) {
                clearInterval(countdownInterval);
                captureImage();
                setIsCapturing(false);
                setCountdown(0);
            }
        }, 1000);
    };

    // Detection is now driven by requestAnimationFrame loop

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-2xl mx-auto">
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
                                onClick={onCancel}
                                icon={<ArrowLeftOutlined />}
                                className="text-lg px-8 py-4 h-auto"
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
            <div className="flex items-center justify-center min-h-[80vh] px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="glass-card border-0 shadow-xl">
                        <div className="text-center mb-6">
                            <Title level={2}>Rasimni Tekshiring</Title>
                        </div>

                        <div className="text-center mb-8">
                            <img
                                src={capturedImageData}
                                alt="Olingan rasm"
                                className="rounded-xl shadow-lg mx-auto w-full max-w-[600px] h-auto"
                                style={{
                                    objectFit: 'contain',
                                    transform: 'scaleX(-1)', // Ko'zgu effekti
                                }}
                            />
                        </div>

                        <div className="text-center">
                            <Space size="large">
                                <Button
                                    size="large"
                                    onClick={onCancel}
                                    icon={<ArrowLeftOutlined />}
                                    className="text-lg px-8 py-4 h-auto"
                                >
                                    Bekor Qilish
                                </Button>
                                <Button
                                    size="large"
                                    onClick={handleRetakePhoto}
                                    className="border-orange-400 text-orange-600 text-lg px-8 py-4 h-auto"
                                >
                                    📷 Qayta Olish
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleSubmitImage}
                                    className="bg-gradient-to-r from-green-500 to-blue-600 border-0 shadow-lg text-lg px-8 py-4 h-auto"
                                >
                                    ✅ Rasimni Yuborish
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-4xl mx-auto w-full">
                <Card className="glass-card border-0 shadow-xl">
                    <div className="text-center mb-6">
                        <Title level={2}>Yuzingizni Joylashtiring</Title>
                        <Text className="text-gray-600 text-lg">
                            {faceDetected
                                ? `✅Avtomatik ravishda ${
                                      3 - faceDetectionCount
                                  } soniyada rasmga olinadi...`
                                : '👤 Avtomatik rasmga olish uchun yuzingizni doira ichiga joylashtiring'}
                        </Text>
                        {!isFaceDetectorSupported() && (
                            <div className="mt-2">
                                <Text className="text-gray-500">
                                    Qurilmangizda avtomatik yuz aniqlash
                                    cheklangan. Iltimos, qo‘lda rasmga oling.
                                </Text>
                            </div>
                        )}
                        {faceDetected && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${
                                                ((faceDetectionCount + 1) / 3) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="camera-container mx-auto mb-8 relative w-full max-w-[600px] aspect-square">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="rounded-xl shadow-lg w-full h-full object-cover"
                            style={{
                                transform: 'scaleX(-1)',
                                filter: 'brightness(1.1) contrast(1.1)',
                            }}
                        />

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                                className={`rounded-full border-4 transition-all duration-500 ${
                                    faceDetected
                                        ? 'border-green-500 bg-green-500 bg-opacity-20'
                                        : 'border-blue-500 bg-blue-500 bg-opacity-10'
                                }`}
                                style={{
                                    width: '55%',
                                    height: '55%',
                                }}
                            />
                        </div>

                        {countdown > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white bg-black bg-opacity-50 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                                    {countdown}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <Space size="large">
                            <Button
                                type="primary"
                                size="large"
                                icon={<CameraOutlined />}
                                onClick={handleManualCapture}
                                disabled={isCapturing}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg text-lg px-8 py-4 h-auto"
                            >
                                {isCapturing
                                    ? 'Rasmga Olinmoqda...'
                                    : 'Rasmga Olish'}
                            </Button>
                            <Button
                                size="large"
                                onClick={onCancel}
                                icon={<ArrowLeftOutlined />}
                                className="shadow-lg text-lg px-8 py-4 h-auto"
                            >
                                Bekor Qilish
                            </Button>
                        </Space>
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </Card>
            </div>
        </div>
    );
};

export default CameraCapture;
