import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import 'intl-pluralrules';
import * as RNLocalize from 'react-native-localize';

// when adding a new language don't forget to add it to deviceLanguage
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
  },
};

const deviceLanguage = RNLocalize.findBestLanguageTag([
  'de',
  'en',
  'es',
  'fr',
])?.languageTag;

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
