import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import type { TankFormData } from '../../types/tankTypes';

type PurposeKey = 'water' | 'food' | 'chemical';

interface PurposeRequirement {
  minThickness: number;
  defaultMaterial: '304' | '316';
  notes: string[];
  helperText: string;
  emoji: string;
  title: string;
  description: string;
}

// Requirement rules based on purpose - using type-safe keys
const purposeRequirements: Record<PurposeKey, PurposeRequirement> = {
  water: {
    minThickness: 3,
    defaultMaterial: '304',
    emoji: '💧',
    title: 'Water Storage',
    description: 'For storing potable water, rainwater, or industrial water',
    notes: [
      'UV protection recommended for outdoor tanks',
      'Prevent algae growth with proper sealing',
      'Check water quality standards compliance'
    ],
    helperText: 'Standard thickness for water storage'
  },
  food: {
    minThickness: 4,
    defaultMaterial: '316',
    emoji: '🧃',
    title: 'Food Industry',
    description: 'For food processing, dairy, beverages, or pharmaceutical use',
    notes: [
      'Use polished stainless steel surfaces',
      'Ensure CIP (Clean-In-Place) compatibility',
      'FDA certificates required for food contact',
      'Higher corrosion resistance needed'
    ],
    helperText: 'Enhanced thickness for food industry'
  },
  chemical: {
    minThickness: 6,
    defaultMaterial: '316',
    emoji: '☣️',
    title: 'Chemical Substances',
    description: 'For storing aggressive chemicals, acids, or industrial solvents',
    notes: [
      'Ensure chemical compatibility and sealing',
      'Maximum corrosion resistance required',
      'Specialized ventilation systems needed',
      'Additional certificates per REACH regulation',
      'Consider duplex steel for aggressive environments'
    ],
    helperText: 'Maximum thickness for chemical storage'
  }
};

const PurposeStep = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<TankFormData>();
  const { t, tString } = useTranslation();
  const purpose = watch('purpose');

  // Auto-adjust parameters when purpose changes
  useEffect(() => {
    if (purpose && purposeRequirements[purpose]) {
      const requirements = purposeRequirements[purpose];
      
      // Set material and wall thickness based on purpose
      setValue('material', requirements.defaultMaterial);
      
      // Set minimum thickness but don't override if user has higher value
      const currentThickness = watch('wallThickness');
      if (!currentThickness || currentThickness < requirements.minThickness) {
        setValue('wallThickness', requirements.minThickness);
      }
    }
  }, [purpose, setValue, watch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('purposeStep.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('purposeStep.subtitle')}
        </p>
      </div>

      {/* Purpose Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(purposeRequirements).map(([key, requirement]) => (
          <label
            key={key}
            className={`relative cursor-pointer group transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              purpose === key
                ? 'ring-3 ring-astra shadow-2xl scale-105'
                : 'hover:ring-2 hover:ring-astra/50'
            }`}
          >
            <input
              type="radio"
              value={key}
              {...register('purpose', { required: tString('dimensionsStep.validation.selectPurpose') })}
              className="sr-only"
            />
            
            <div className={`relative p-8 rounded-2xl border-2 transition-all duration-300 h-full flex flex-col justify-between ${
              purpose === key
                ? 'border-primary-blue bg-primary-blue/5'
                : 'border-border-primary bg-white group-hover:border-primary-blue/50'
            }`}>
              {/* Selection indicator */}
              {purpose === key && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Emoji and Title */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{requirement.emoji}</div>
                <h3 className="text-xl font-bold text-neutral-dark mb-2">
                  {t(`purposeStep.${key}.title`)}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(`purposeStep.${key}.description`)}
                </p>
              </div>
              
              {/* Technical specs preview */}
              <div className="space-y-3 pt-4 border-t border-border-primary">
                {/* Removed Min. Wall Thickness and Recommended Material */}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Error message */}
      {errors.purpose && (
        <div className="text-center">
          <p className="text-error text-sm">{errors.purpose.message}</p>
        </div>
      )}

      {/* Dynamic requirements and notes */}
      {purpose && (
        <div className={`mt-12 p-8 card border border-primary-blue/20`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">{purposeRequirements[purpose].emoji}</div>
            <div>
              <h3 className="text-xl font-bold text-neutral-dark">
                {t(`purposeStep.${purpose}.title`)} {t('purposeStep.requirements')}
              </h3>
              <p className="text-sm text-muted">
                {t('purposeStep.autoConfig')}
              </p>
            </div>
          </div>

          {/* Detailed recommendations */}
          <div className="space-y-4">
            <p className="text-sm text-muted">
              - {t(`purposeStep.${purpose}.notes.0`)}
            </p>
            <p className="text-sm text-muted">
              - {t(`purposeStep.${purpose}.notes.1`)}
            </p>
            <p className="text-sm text-muted">
              - {t(`purposeStep.${purpose}.notes.2`)}
            </p>
            <p className="text-sm font-semibold text-neutral-dark">
              {t(`purposeStep.${purpose}.helperText`)}
            </p>
            {/* Recommended Material */}
            <p className="text-sm font-semibold text-neutral-dark">
              {t(`purposeStep.${purpose}.recommendedMaterial`)}: {purposeRequirements[purpose].defaultMaterial}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurposeStep;
