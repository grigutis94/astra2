import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
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
          What is the intended use of the tank?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Choose the primary purpose to automatically configure optimal specifications
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
              {...register('purpose', { required: 'Please select a purpose' })}
              className="sr-only"
            />
            
            <div className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
              purpose === key
                ? 'border-astra bg-astra/5 dark:bg-astra/10'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-astra/50'
            }`}>
              {/* Selection indicator */}
              {purpose === key && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-astra rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Emoji and Title */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{requirement.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {requirement.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {requirement.description}
                </p>
              </div>
              
              {/* Technical specs preview */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Min. Wall Thickness:</span>
                  <span className="font-semibold text-astra">{requirement.minThickness} mm</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Recommended Material:</span>
                  <span className="font-semibold text-astra">AISI {requirement.defaultMaterial}</span>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Error message */}
      {errors.purpose && (
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 text-sm">{errors.purpose.message}</p>
        </div>
      )}

      {/* Dynamic requirements and notes */}
      {purpose && (
        <div className="mt-12 p-8 bg-gradient-to-r from-astra/5 to-astra-soft/5 dark:from-astra/10 dark:to-astra-soft/10 rounded-2xl border border-astra/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">{purposeRequirements[purpose].emoji}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {purposeRequirements[purpose].title} Requirements
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatic configuration applied
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Technical Requirements */}
            <div>
              <h4 className="font-semibold text-astra mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-astra rounded-full"></div>
                Technical Specifications
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Minimum Wall Thickness:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{purposeRequirements[purpose].minThickness} mm</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recommended Material:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">AISI {purposeRequirements[purpose].defaultMaterial}</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div>
              <h4 className="font-semibold text-astra mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-astra rounded-full"></div>
                Important Considerations
              </h4>
              <ul className="space-y-2">
                {purposeRequirements[purpose].notes.map((note, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-astra-soft rounded-full mt-2 flex-shrink-0"></div>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurposeStep;
