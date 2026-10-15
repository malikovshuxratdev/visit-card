import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type StepperProps = {
    steps: string[];
    /** Zero-based index of the current step. */
    current: number;
    className?: string;
};

export function Stepper({ steps, current, className }: StepperProps) {
    return (
        <ol className={cn('flex shrink-0 items-center gap-1.5 sm:gap-3', className)}>
            {steps.map((label, index) => {
                const isDone = index < current;
                const isActive = index === current;
                return (
                    <li
                        key={label}
                        className="flex items-center gap-1.5 sm:gap-3"
                        aria-current={isActive ? 'step' : undefined}
                    >
                        {index > 0 && (
                            <span
                                aria-hidden
                                className={cn(
                                    'hidden h-px w-6 sm:block lg:w-10',
                                    isDone || isActive
                                        ? 'bg-brand-400/70'
                                        : 'bg-white/15'
                                )}
                            />
                        )}
                        <span
                            className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:h-8 sm:w-8 sm:text-sm',
                                isDone && 'bg-brand-500 text-ink-950',
                                isActive &&
                                    'bg-white text-ink-950 ring-2 ring-white/15 sm:ring-4',
                                !isDone &&
                                    !isActive &&
                                    'bg-white/10 text-white/60'
                            )}
                        >
                            {isDone ? (
                                <Check size={16} strokeWidth={3} />
                            ) : (
                                index + 1
                            )}
                        </span>
                        <span
                            className={cn(
                                'hidden text-sm font-medium md:inline',
                                isActive ? 'text-white' : 'text-white/60'
                            )}
                        >
                            {label}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default Stepper;
