import { useEffect, useRef, useState, useCallback } from 'react';
import {
    FaceDetector,
    FilesetResolver,
    type FaceDetectorResult,
} from '@mediapipe/tasks-vision';

const BLAZE_FACE_MODEL =
    'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';
const WASM_PATH =
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm';

export interface FaceAlignmentState {
    isDetected: boolean;
    isAligned: boolean;
    alignmentScore: number;
    consecutiveGoodFrames: number;
}

const REQUIRED_CONSECUTIVE_FRAMES = 6;
const MIN_CONFIDENCE = 0.75;
const CENTER_TOLERANCE = 0.18;
const MIN_FACE_SIZE = 0.18;
const MAX_FACE_SIZE = 0.65;
const DETECTION_INTERVAL_MS = 120;

function checkFaceAlignment(
    result: FaceDetectorResult,
    videoWidth: number,
    videoHeight: number
): FaceAlignmentState {
    const detections = result?.detections ?? [];
    if (!Array.isArray(detections) || detections.length === 0) {
        return {
            isDetected: false,
            isAligned: false,
            alignmentScore: 0,
            consecutiveGoodFrames: 0,
        };
    }
    if (detections.length > 1) {
        return {
            isDetected: true,
            isAligned: false,
            alignmentScore: 0.5,
            consecutiveGoodFrames: 0,
        };
    }

    const face = detections[0];
    const score = face?.categories?.[0]?.score ?? 0;
    const box = face?.boundingBox;

    if (!box || typeof box.originX !== 'number' || typeof box.width !== 'number') {
        return {
            isDetected: score > 0.5,
            isAligned: false,
            alignmentScore: score,
            consecutiveGoodFrames: 0,
        };
    }

    if (videoWidth <= 0 || videoHeight <= 0) {
        return {
            isDetected: score > 0.5,
            isAligned: false,
            alignmentScore: 0,
            consecutiveGoodFrames: 0,
        };
    }

    const centerX = (box.originX + box.width / 2) / videoWidth;
    const centerY = (box.originY + box.height / 2) / videoHeight;
    const faceSizeX = box.width / videoWidth;
    const faceSizeY = box.height / videoHeight;

    const centerOffsetX = Math.abs(centerX - 0.5);
    const centerOffsetY = Math.abs(centerY - 0.5);
    const isCentered =
        centerOffsetX <= CENTER_TOLERANCE && centerOffsetY <= CENTER_TOLERANCE;

    const faceSize = Math.max(faceSizeX, faceSizeY);
    const isGoodSize = faceSize >= MIN_FACE_SIZE && faceSize <= MAX_FACE_SIZE;

    const alignmentScore =
        (1 - Math.min((centerOffsetX + centerOffsetY) / (CENTER_TOLERANCE * 2), 1)) *
            0.4 +
        (isGoodSize ? 0.3 : 0) +
        Math.min(score, 1) * 0.3;

    const isAligned = isCentered && isGoodSize && score >= MIN_CONFIDENCE;

    return {
        isDetected: true,
        isAligned,
        alignmentScore: Math.round(alignmentScore * 100) / 100,
        consecutiveGoodFrames: isAligned ? 1 : 0,
    };
}

export function useFaceDetection(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    stream: MediaStream | null,
    pauseAutoCapture: boolean,
    onAlignedAndReady: () => void
) {
    const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [state, setState] = useState<FaceAlignmentState>({
        isDetected: false,
        isAligned: false,
        alignmentScore: 0,
        consecutiveGoodFrames: 0,
    });

    const lastProcessTimeRef = useRef(0);
    const animationFrameRef = useRef<number>();
    const consecutiveCountRef = useRef(0);
    const onAlignedRef = useRef(onAlignedAndReady);
    onAlignedRef.current = onAlignedAndReady;
    const detectorRef = useRef<FaceDetector | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoadError(null);

        FilesetResolver.forVisionTasks(WASM_PATH)
            .then((vision) =>
                FaceDetector.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: BLAZE_FACE_MODEL,
                    },
                    runningMode: 'IMAGE',
                    minDetectionConfidence: 0.6,
                    minSuppressionThreshold: 0.3,
                })
            )
            .then((detector) => {
                if (cancelled) {
                    detector.close();
                    return;
                }
                detectorRef.current = detector;
                setFaceDetector(detector);
                setIsModelLoaded(true);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Yuz aniqlash modeli yuklanmadi:', err);
                    setLoadError(
                        err?.message ?? 'AI model yuklanmadi. Qo‘lda rasmga oling.'
                    );
                }
            });

        return () => {
            cancelled = true;
            detectorRef.current?.close();
            detectorRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!faceDetector || !stream) return;

        const video = videoRef.current;
        if (!video) return;

        const processFrame = () => {
            const now = performance.now();
            if (now - lastProcessTimeRef.current < DETECTION_INTERVAL_MS) {
                animationFrameRef.current = requestAnimationFrame(processFrame);
                return;
            }

            const w = video.videoWidth;
            const h = video.videoHeight;

            if (
                video.readyState >= 2 &&
                w > 0 &&
                h > 0 &&
                detectorRef.current
            ) {
                lastProcessTimeRef.current = now;
                try {
                    const result = detectorRef.current.detect(video);
                    const alignment = checkFaceAlignment(result, w, h);

                    if (alignment.isAligned) {
                        if (!pauseAutoCapture) {
                            consecutiveCountRef.current += 1;
                            if (
                                consecutiveCountRef.current >=
                                REQUIRED_CONSECUTIVE_FRAMES
                            ) {
                                consecutiveCountRef.current = 0;
                                onAlignedRef.current();
                            }
                        }
                    } else {
                        consecutiveCountRef.current = 0;
                    }

                    setState({
                        ...alignment,
                        consecutiveGoodFrames: alignment.isAligned
                            ? consecutiveCountRef.current
                            : 0,
                    });
                } catch (err) {
                    consecutiveCountRef.current = 0;
                    setState((s) => ({
                        ...s,
                        isDetected: false,
                        consecutiveGoodFrames: 0,
                    }));
                }
            }

            animationFrameRef.current = requestAnimationFrame(processFrame);
        };

        animationFrameRef.current = requestAnimationFrame(processFrame);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            consecutiveCountRef.current = 0;
        };
    }, [faceDetector, stream, pauseAutoCapture, videoRef]);

    const resetConsecutive = useCallback(() => {
        consecutiveCountRef.current = 0;
        setState((s) => ({ ...s, consecutiveGoodFrames: 0 }));
    }, []);

    return { state, isModelLoaded, loadError, resetConsecutive };
}
