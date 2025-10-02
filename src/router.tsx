import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/Layout';
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import GeneratorPage from './pages/GeneratorPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'camera',
                element: <CameraPage />,
            },
            {
                path: 'generator',
                element: <GeneratorPage />,
            },
        ],
    },
]);
