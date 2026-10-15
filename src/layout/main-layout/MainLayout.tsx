import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import innovationIcon from '@/assets/icons/innovation.svg';
import { paths } from '@/routes/path';
import { BrandBackground, PageLoader, Stepper } from '@/shared/ui';
import { TokenService } from '@/shared/utils/storage';

const useCurrentStep = () => {
    const { pathname } = useLocation();
    if (matchPath(paths.GENERATOR, pathname)) return 2;
    if (matchPath(paths.CAMERA, pathname)) return 1;
    return 0;
};

function MainLayout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const currentStep = useCurrentStep();
    const token = TokenService.getToken();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [pathname]);

    if (!token) {
        return <Navigate to={paths.LOGIN} replace />;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <BrandBackground />

            <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/60 backdrop-blur-xl">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => navigate(paths.HOME)}
                        aria-label={t('common.brand.home-label')}
                        className="group flex min-w-0 items-center gap-3 rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400"
                    >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-card ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12">
                            <img
                                src={innovationIcon}
                                alt=""
                                className="h-8 w-8 sm:h-9 sm:w-9"
                            />
                        </span>
                        <span className="flex min-w-0 flex-col">
                            <span className="truncate text-lg font-bold leading-6 tracking-tight text-white sm:text-xl">
                                {t('common.brand.name')}{' '}
                                <span className="text-brand-400">
                                    {t('common.brand.accent')}
                                </span>
                            </span>
                            <span className="truncate text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-white/55 max-[379px]:hidden sm:text-xs sm:tracking-[0.16em]">
                                {t('common.brand.tagline')}
                            </span>
                        </span>
                    </button>

                    <Stepper
                        steps={[
                            t('steps.science-id'),
                            t('steps.face-id'),
                            t('steps.print'),
                        ]}
                        current={currentStep}
                    />
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
}

export default MainLayout;
