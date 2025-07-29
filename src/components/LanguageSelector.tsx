import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-1 bg-white rounded-lg border border-border-primary p-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              language === lang.code
                ? 'bg-primary-blue/20 text-primary-blue shadow-sm'
                : 'text-neutral-dark hover:bg-neutral-light'
            }`}
            title={lang.name}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
