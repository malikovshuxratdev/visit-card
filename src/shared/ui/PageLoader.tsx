import { Spin } from 'antd';

type PageLoaderProps = {
    label?: string;
    fullScreen?: boolean;
};

export function PageLoader({ label, fullScreen = false }: PageLoaderProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={
                fullScreen
                    ? 'flex min-h-screen flex-col items-center justify-center gap-4'
                    : 'flex min-h-[50vh] flex-col items-center justify-center gap-4'
            }
        >
            <Spin size="large" />
            {label && <p className="text-base text-white/75">{label}</p>}
        </div>
    );
}

export default PageLoader;
