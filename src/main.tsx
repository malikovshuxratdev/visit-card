import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'antd/dist/reset.css';
import './index.css';
import Providers from './Providers';
import { router } from './routes/Routes';
import { PageLoader } from './shared/ui';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <Suspense fallback={<PageLoader fullScreen />}>
                <RouterProvider router={router} />
            </Suspense>
        </Providers>
    </StrictMode>
);
