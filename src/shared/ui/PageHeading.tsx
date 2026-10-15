import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type PageHeadingProps = {
    eyebrow?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    align?: 'left' | 'center';
    className?: string;
};

export function PageHeading({
    eyebrow,
    title,
    subtitle,
    align = 'left',
    className,
}: PageHeadingProps) {
    return (
        <header
            className={cn(
                'space-y-2',
                align === 'center' && 'text-center',
                className
            )}
        >
            {eyebrow && (
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-300">
                    {eyebrow}
                </p>
            )}
            <h1 className="text-balance text-2xl font-bold leading-tight text-white sm:text-3xl">
                {title}
            </h1>
            {subtitle && (
                <p
                    className={cn(
                        'text-pretty text-base leading-relaxed text-white/70',
                        align === 'center' && 'mx-auto max-w-prose'
                    )}
                >
                    {subtitle}
                </p>
            )}
        </header>
    );
}

export default PageHeading;
