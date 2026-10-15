import i18next, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from '../public/locales/uz/translation.json';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/shared/constants';

const options: InitOptions = {
    resources: { uz: { translation: uz } },
    lng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
};

const i18n = i18next.createInstance();
i18n.use(initReactI18next).init(options);

export default i18n;
