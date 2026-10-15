import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraErrorCode } from '@/features/face-id/types';

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
    facingMode: 'user',
    width: { ideal: 640 },
    height: { ideal: 480 },
};

const toErrorCode = (error: unknown): CameraErrorCode => {
    const name = error instanceof DOMException ? error.name : '';
    if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
    if (name === 'NotFoundError' || name === 'OverconstrainedError') {
        return 'not-found';
    }
    return 'unavailable';
};

const stopTracks = (stream: MediaStream | null) =>
    stream?.getTracks().forEach((track) => track.stop());

/** Owns the webcam stream; always releases it on stop/unmount. */
export const useCamera = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<CameraErrorCode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mountedRef = useRef(false);

    const stop = useCallback(() => {
        stopTracks(streamRef.current);
        streamRef.current = null;
        setStream(null);
    }, []);

    const start = useCallback(async () => {
        setError(null);
        if (!navigator.mediaDevices?.getUserMedia) {
            setError('unsupported');
            return;
        }
        try {
            const next = await navigator.mediaDevices.getUserMedia({
                video: VIDEO_CONSTRAINTS,
                audio: false,
            });
            if (!mountedRef.current) {
                stopTracks(next);
                return;
            }
            stopTracks(streamRef.current);
            streamRef.current = next;
            setStream(next);
        } catch (err) {
            if (mountedRef.current) setError(toErrorCode(err));
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        start();
        return () => {
            mountedRef.current = false;
            stopTracks(streamRef.current);
            streamRef.current = null;
        };
    }, [start]);

    return { stream, error, start, stop };
};
