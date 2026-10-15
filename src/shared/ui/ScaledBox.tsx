import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type ScaledBoxProps = {
    /** Natural (unscaled) size of the content in px. */
    width: number;
    height: number;
    /** Never scale above this factor. */
    maxScale?: number;
    className?: string;
    children: ReactNode;
};

/**
 * Renders fixed-size content (e.g. a print-accurate card) scaled down to fit
 * the available width. The child keeps its natural size in the DOM, so
 * exporting it to an image is unaffected by the visual scale.
 */
export function ScaledBox({
    width,
    height,
    maxScale = 1,
    className,
    children,
}: ScaledBoxProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(maxScale);

    useLayoutEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const update = () => {
            const available = node.clientWidth;
            if (available > 0) {
                setScale(Math.min(available / width, maxScale));
            }
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, [width, maxScale]);

    return (
        <div ref={containerRef} className={cn('w-full', className)}>
            <div
                className="relative mx-auto"
                style={{ width: width * scale, height: height * scale }}
            >
                <div
                    className="absolute left-0 top-0 origin-top-left"
                    style={{ width, height, transform: `scale(${scale})` }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ScaledBox;
