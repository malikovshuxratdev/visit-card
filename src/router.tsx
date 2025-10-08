import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/Layout';
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import GeneratorPage from './pages/GeneratorPage';
import LoginPage from './pages/LoginPage';
import ScienceIdPage from './pages/ScienceIdPage';

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
                path: 'camera/:id?',
                element: <CameraPage />,
            },
            {
                path: 'generator/:id',
                element: <GeneratorPage />,
            },
        ],
    },
]);
