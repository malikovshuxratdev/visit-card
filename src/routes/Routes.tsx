/* eslint-disable react-refresh/only-export-components -- route table, not a component module */
import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { paths } from './path';
import ErrorBoundaryPage from '@/shared/pages/ErrorBoundaryPage';

const MainLayout = lazy(() => import('@/layout/main-layout/MainLayout'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const HomePage = lazy(() => import('@/features/science-id/pages/HomePage'));
const CameraPage = lazy(() => import('@/features/face-id/pages/CameraPage'));
const GeneratorPage = lazy(
    () => import('@/features/visit-card/pages/GeneratorPage')
);
const NotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'));

const routes: RouteObject[] = [
    {
        errorElement: <ErrorBoundaryPage />,
        children: [
            { path: paths.LOGIN, element: <LoginPage /> },
            {
                element: <MainLayout />,
                children: [
                    { path: paths.HOME, element: <HomePage /> },
                    { path: paths.CAMERA, element: <CameraPage /> },
                    { path: paths.GENERATOR, element: <GeneratorPage /> },
                ],
            },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
];

export const router = createBrowserRouter(routes);
