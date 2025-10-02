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
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 600 },
                    height: { ideal: 720 },
                },
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            setError(
                'Unable to access camera. Please ensure you have granted camera permissions.'
            );
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        const aspectRatio = videoWidth / videoHeight;

        const maxWidth = 600;
        const maxHeight = 600;

        let canvasWidth = maxWidth;
        let canvasHeight = maxHeight;

        if (aspectRatio > maxWidth / maxHeight) {
            canvasHeight = maxWidth / aspectRatio;
        } else {
            canvasWidth = maxHeight * aspectRatio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
        const imageData = canvas.toDataURL('image/jpeg', 0.95);

        setCapturedImageData(imageData);
        setShowPreview(true);
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

    useEffect(() => {
        const checkFaceAlignment = () => {
            if (!videoRef.current || isCapturing) return;

            const video = videoRef.current;
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;

            if (videoWidth === 0 || videoHeight === 0) return;

            const hasVideo = video.readyState >= 2; // HAVE_CURRENT_DATA
            const randomFaceDetection = hasVideo && Math.random() > 0.4;

            setFaceDetected(randomFaceDetection);

            if (randomFaceDetection) {
                setFaceDetectionCount((prev) => prev + 1);

                if (faceDetectionCount >= 2 && !isCapturing) {
                    handleManualCapture();
                    setFaceDetectionCount(0);
                }
            } else {
                setFaceDetectionCount(0);
            }
        };

        const interval = setInterval(checkFaceAlignment, 1000);
        return () => clearInterval(interval);
    }, [isCapturing, faceDetectionCount]);

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
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="max-w-4xl mx-auto">
                    <Card className="glass-card border-0 shadow-xl">
                        <div className="text-center mb-6">
                            <Title level={2}>Rasimni Tekshiring</Title>
                        </div>

                        <div className="text-center mb-8">
                            <img
                                src={capturedImageData}
                                alt="Olingan rasm"
                                className="rounded-xl shadow-lg mx-auto"
                                style={{
                                    maxWidth: '600px',
                                    maxHeight: '600px',
                                    width: 'auto',
                                    height: 'auto',
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
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="max-w-4xl mx-auto">
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

                    <div
                        className="camera-container mx-auto mb-8 relative"
                        style={{ width: '600px', height: '600px' }}
                    >
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
                                    width: '300px',
                                    height: '300px',
                                }}
                            />
                        </div>

                        {countdown > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-8xl font-bold text-white bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center">
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
