import type { ReactNode } from 'react';
import { CARD_HEIGHT, CARD_WIDTH } from '@/features/visit-card/constants';
import { cn } from '@/shared/lib/utils';
import { ScaledBox } from '@/shared/ui';

type CardPreviewProps = {
    label?: string;
    maxScale?: number;
    className?: string;
    children: ReactNode;
};

/** A card scaled to the available width, with an optional caption. */
export function CardPreview({
    label,
    maxScale = 1,
    className,
    children,
}: CardPreviewProps) {
    return (
        <figure className={cn('flex w-full flex-col gap-3', className)}>
            <ScaledBox width={CARD_WIDTH} height={CARD_HEIGHT} maxScale={maxScale}>
                <div className="rounded-[8px] shadow-card">{children}</div>
            </ScaledBox>
            {label && (
                <figcaption className="text-center text-sm font-medium text-white/60">
                    {label}
                </figcaption>
            )}
        </figure>
    );
}

export default CardPreview;
