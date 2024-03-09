import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import "intl-pluralrules";

const resources = {
    en: {
        translation: require('./translations/en.json'),
    },
    de: {
        translation: require('./translations/de.json'),
    },
    es: {
        translation: require('./translations/es.json'),
    },
    fr: {
        translation: require('./translations/fr.json'),
    }
};

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});
