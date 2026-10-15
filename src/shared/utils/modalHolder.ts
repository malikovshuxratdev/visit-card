import type { ModalStaticFunctions } from 'antd/es/modal/confirm';

type ModalApi = Omit<ModalStaticFunctions, 'warn'>;

let modalApi: ModalApi | null = null;

/** Registered from inside <AntApp> so imperative modals inherit the theme. */
export const registerModalApi = (api: ModalApi) => {
    modalApi = api;
};

export const getModalApi = () => modalApi;
