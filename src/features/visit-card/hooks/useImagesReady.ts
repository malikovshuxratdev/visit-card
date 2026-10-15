import { useEffect, useState } from 'react';

/** Resolves once every image has loaded or failed, so the UI never hangs. */
export const useImagesReady = (sources: string[]) => {
    const [isReady, setIsReady] = useState(false);
    const key = sources.join('|');

    useEffect(() => {
        let cancelled = false;
        setIsReady(false);

        Promise.all(
            key.split('|').map(
                (src) =>
                    new Promise<void>((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                        img.src = src;
                    })
            )
        ).then(() => {
            if (!cancelled) setIsReady(true);
        });

        return () => {
            cancelled = true;
        };
    }, [key]);

    return isReady;
};
