# ASTRA Tank Configurator - Internationalization (i18n)

## Daugiakalbystės palaikymas

Aplikacija palaiko **3 kalbas**:
- 🇱🇹 **Lietuvių** (numatytoji)  
- 🇬🇧 **Anglų**
- 🇷🇺 **Rusų**

## Funkcionalumas

### Kalbų perjungimas
- **Kalbos pasirinkiklis** viršutiniame dešiniajame kampe
- **Automatinis išsaugojimas** localStorage
- **Realaus laiko perjungimas** be puslapio perkrovimo
- **Numatytoji kalba**: Lietuvių

### Išversti komponentai
1. **Header** - pavadinimas ir aprašymas
2. **FormStepper** - žingsnių pavadinimai ir progreso indikatoriai
3. **PurposeStep** - talpyklos paskirčių aprašymai
4. **DimensionsStep** - dimensijų laukai ir validacijos
5. **MaterialStep** - medžiagų pavadinimai ir aprašymai
6. **AccessoriesStep** - priedų pavadinimai ir aprašymai
7. **Mygtukai** - "Toliau", "Atgal", "Baigti"
8. **Validacijos** - klaidos pranešimai

## Techninė implementacija

### Failų struktūra
```
src/
├── contexts/
│   └── LanguageContext.tsx     # Kalbos kontekstas
├── components/
│   └── LanguageSelector.tsx    # Kalbos pasirinkiklis
├── locales/                    # Vertimų failai
│   ├── lt.json                # Lietuvių kalba
│   ├── en.json                # Anglų kalba
│   └── ru.json                # Rusų kalba
└── types/
    └── json.d.ts              # JSON modulių tipai
```

### Konteksto naudojimas
```tsx
import { useTranslation } from '../contexts/LanguageContext';

const { t } = useTranslation();
const text = t('common.next'); // "Toliau"
```

### Kalbos keitimas
```tsx
import { useLanguage } from '../contexts/LanguageContext';

const { language, setLanguage } = useLanguage();
setLanguage('en'); // Pakeisti į anglų
```

### Vertimų struktūra
```json
{
  "common": {
    "next": "Toliau",
    "previous": "Atgal"
  },
  "purposeStep": {
    "title": "Pasirinkite talpyklos paskirtį",
    "water": {
      "title": "Vandens saugojimas",
      "description": "..."
    }
  }
}
```

## Pridėti naują kalbą

1. **Sukurti vertimo failą**:
   ```bash
   src/locales/de.json  # Vokiečių kalba
   ```

2. **Pridėti kalbą į tipą**:
   ```tsx
   export type Language = 'lt' | 'en' | 'ru' | 'de';
   ```

3. **Importuoti vertimą**:
   ```tsx
   import deTranslations from '../locales/de.json';
   ```

4. **Pridėti į LanguageSelector**:
   ```tsx
   { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
   ```

## Naudojimo instrukcijos

### Vartotojams
1. Atidaryti aplikaciją: `http://localhost:5174`
2. Viršutiniame dešiniajame kampe spausti vėliavėlę
3. Pasirinkti norimą kalbą
4. Visas turinys automatiškai pasikeičia

### Kūrėjams
1. Naudoti `t()` funkciją vietoj hardcoded tekstų
2. Pridėti naujus vertimo raktus į visus kalbų failus
3. Naudoti struktūrizuotus raktus: `'section.subsection.key'`
4. Tikrinti, kad visi tekstai yra išversti

## Ypatybės

- ✅ **Automatinis išsaugojimas** localStorage
- ✅ **TypeScript palaikymas** su tipų saugumu
- ✅ **Hot reload** development metu
- ✅ **Fallback į lietuvių** jei vertimas nerastas
- ✅ **Kompaktiškas dizainas** kalbos pasirinkiklyje
- ✅ **Accessibility** su klaviatūros navigacija

## Vertimų raktai

### Pagrindiniai raktai
- `common.*` - Bendri elementai (mygtukai, etc.)
- `header.*` - Aplikacijos header
- `stepper.*` - Formų žingsnių pavadinimai
- `purposeStep.*` - Pirmasis žingsnis
- `dimensionsStep.*` - Antrasis žingsnis
- `materialStep.*` - Trečiasis žingsnis
- `accessoriesStep.*` - Ketvirtasis žingsnis

### Dinaminiai vertikai
Palaikomi parametrai vertimo tekstuose:
```tsx
t('validation.min').replace('{{min}}', '100')
// "Minimumas {{min}}mm" → "Minimumas 100mm"
```

## Testavimas

1. **Perjungti kalbas** ir patikrinti visus komponentus
2. **Atnaujinti puslapį** - kalba turi išlikti
3. **Patikrinti validacijas** visose kalbose  
4. **Testuoti formos funkcionavimą** skirtingose kalbose

---
**Sukurta**: 2025-01-25  
**Versija**: 1.0  
**Palaikomos kalbos**: LT, EN, RU
