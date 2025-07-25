import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'lt' | 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string | string[];
  tString: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import translations
import ltTranslations from '../locales/lt.json';
import enTranslations from '../locales/en.json';
import ruTranslations from '../locales/ru.json';

const translations = {
  lt: ltTranslations,
  en: enTranslations,
  ru: ruTranslations
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('lt'); // Default to Lithuanian

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['lt', 'en', 'ru'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string | string[] => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Lithuanian if key not found
        value = translations['lt'];
        for (const fallbackK of keys) {
          if (value && typeof value === 'object' && fallbackK in value) {
            value = value[fallbackK];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    // Return array if it's an array, string if it's a string, or key if not found
    if (Array.isArray(value)) {
      return value;
    } else if (typeof value === 'string') {
      return value;
    } else {
      return key;
    }
  };

  // Translation function that always returns string
  const tString = (key: string): string => {
    const result = t(key);
    if (Array.isArray(result)) {
      return result.join(', '); // Join arrays with comma for string representation
    }
    return result;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    tString
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t, tString } = useLanguage();
  return { t, tString };
};
