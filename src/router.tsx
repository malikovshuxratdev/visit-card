import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/Layout';
import HomePage from './pages/HomePage';
import ScienceIdPage from './pages/ScienceIdPage';
import CameraPage from './pages/CameraPage';
import GeneratorPage from './pages/GeneratorPage';
import LoginPage from './pages/LoginPage';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'science-id',
                element: <ScienceIdPage />,
            },
            {
                path: 'camera',
                element: <CameraPage />,
            },
            {
                path: 'generator/:id',
                element: <GeneratorPage />,
            },
        ],
    },
]);
