export const HOME = '/';
export const LOGIN = '/login';
export const CAMERA = '/camera/:id?';
export const GENERATOR = '/generator/:id';

export const paths = {
    HOME,
    LOGIN,
    CAMERA,
    GENERATOR,
    camera: (pnflCode?: string) =>
        pnflCode ? `/camera/${encodeURIComponent(pnflCode)}` : '/camera',
    generator: (pnflCode: string) =>
        `/generator/${encodeURIComponent(pnflCode)}`,
};

export default paths;
