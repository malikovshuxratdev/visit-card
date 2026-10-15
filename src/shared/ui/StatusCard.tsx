import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import Panel from './Panel';

type Tone = 'error' | 'warning' | 'info';

const toneStyles: Record<Tone, string> = {
    error: 'bg-red-500/15 text-red-300 ring-red-400/30',
    warning: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
    info: 'bg-scan/15 text-scan-soft ring-scan/30',
};

type StatusCardProps = {
    icon: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    tone?: Tone;
    className?: string;
};

export function StatusCard({
    icon,
    title,
    description,
    actions,
    tone = 'info',
    className,
}: StatusCardProps) {
    return (
        <Panel
            className={cn(
                'mx-auto flex w-full max-w-lg animate-fade-up flex-col items-center gap-5 text-center',
                className
            )}
        >
            <div
                className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-2xl ring-1',
                    toneStyles[tone]
                )}
            >
                {icon}
            </div>
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                    {title}
                </h1>
                {description && (
                    <p className="text-pretty text-base text-white/70">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    {actions}
                </div>
            )}
        </Panel>
    );
}

export default StatusCard;
