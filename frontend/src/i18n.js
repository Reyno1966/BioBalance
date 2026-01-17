import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            es: { translation: es },
            it: { translation: it },
            pt: { translation: pt },
            de: { translation: de },
            fr: { translation: fr },
            ar: { translation: ar },
            ru: { translation: ru },
            zh: { translation: zh },
            ja: { translation: ja },
            ko: { translation: ko }
        },
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
