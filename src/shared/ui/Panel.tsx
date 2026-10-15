import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

type PanelProps = HTMLAttributes<HTMLElement> & {
    as?: 'section' | 'div' | 'aside';
};

export function Panel({ as: Tag = 'section', className, ...props }: PanelProps) {
    return (
        <Tag
            className={cn('glass rounded-3xl p-6 sm:p-8', className)}
            {...props}
        />
    );
}

export default Panel;
