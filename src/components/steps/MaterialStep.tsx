import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { TankFormData } from '../../types/tankTypes';

const MaterialStep = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<TankFormData>();
  
  const purpose = watch('purpose');
  const material = watch('material');
  const innerSurface = watch('innerSurface');
  const outerSurface = watch('outerSurface');

  // Material options with detailed specifications
  const materialOptions = {
    '304': {
      title: 'AISI 304',
      description: 'Standard stainless steel, good corrosion resistance',
      applications: ['Water storage', 'Food processing', 'General industrial'],
      composition: '18% Chromium, 8% Nickel',
      costLevel: 'Standard',
      color: 'from-gray-300 to-gray-400',
      recommended: ['water']
    },
    '316': {
      title: 'AISI 316L',
      description: 'Superior corrosion resistance, marine grade',
      applications: ['Chemical processing', 'Marine environments', 'Pharmaceutical'],
      composition: '18% Chromium, 10% Nickel, 2% Molybdenum',
      costLevel: 'Premium',
      color: 'from-blue-300 to-blue-400',
      recommended: ['food', 'chemical']
    },
    'duplex': {
      title: 'Duplex Steel',
      description: 'High strength, excellent corrosion resistance',
      applications: ['Aggressive chemicals', 'High-pressure applications'],
      composition: 'Ferritic-Austenitic structure',
      costLevel: 'High-end',
      color: 'from-purple-300 to-purple-400',
      recommended: ['chemical']
    },
    'alloy': {
      title: 'Special Alloy',
      description: 'Custom alloy for specific applications',
      applications: ['Extreme conditions', 'Specialized chemicals'],
      composition: 'Application-specific composition',
      costLevel: 'Custom',
      color: 'from-yellow-300 to-yellow-400',
      recommended: ['chemical']
    }
  };

  // Surface finish options
  const surfaceOptions = {
    inner: {
      polished: {
        title: 'Polished',
        description: 'Mirror-like finish, easy to clean',
        ra: '< 0.5 μm',
        applications: ['Food grade', 'Pharmaceutical', 'High hygiene']
      },
      standard: {
        title: 'Standard',
        description: 'Mill finish, cost-effective',
        ra: '1.6 μm',
        applications: ['Water storage', 'General industrial']
      },
      brushed: {
        title: 'Brushed',
        description: 'Directional finish, good cleanability',
        ra: '1.0 μm',
        applications: ['Food processing', 'Chemical storage']
      }
    },
    outer: {
      painted: {
        title: 'Painted',
        description: 'Protective coating, customizable color',
        applications: ['Outdoor installations', 'Aesthetic requirements']
      },
      galvanized: {
        title: 'Galvanized',
        description: 'Zinc coating for corrosion protection',
        applications: ['Outdoor environments', 'Cost-effective protection']
      },
      'bare-steel': {
        title: 'Bare Steel',
        description: 'Natural steel finish',
        applications: ['Indoor installations', 'Budget-friendly']
      }
    }
  };

  // Auto-set recommended surfaces based on purpose and material
  useEffect(() => {
    if (purpose && material) {
      // Set inner surface based on purpose
      if (purpose === 'food' && !innerSurface) {
        setValue('innerSurface', 'polished');
      } else if (purpose === 'chemical' && !innerSurface) {
        setValue('innerSurface', 'brushed');
      } else if (purpose === 'water' && !innerSurface) {
        setValue('innerSurface', 'standard');
      }

      // Set outer surface based on application
      if (!outerSurface) {
        setValue('outerSurface', 'painted'); // Default to painted for protection
      }
    }
  }, [purpose, material, innerSurface, outerSurface, setValue]);

  const getRecommendationLevel = (materialKey: string) => {
    const materialInfo = materialOptions[materialKey as keyof typeof materialOptions];
    if (purpose && materialInfo.recommended.includes(purpose)) {
      return 'highly-recommended';
    }
    return 'standard';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Choose the construction material and surface treatment
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Material selection is automatically optimized for your {purpose ? `${purpose} application` : 'application'}
        </p>
      </div>

      {/* Material Selection */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Construction Material
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(materialOptions).map(([key, option]) => {
            const recommendationLevel = getRecommendationLevel(key);
            const isRecommended = recommendationLevel === 'highly-recommended';
            
            return (
              <label
                key={key}
                className={`relative cursor-pointer group transition-all duration-300 transform hover:scale-105 ${
                  material === key
                    ? 'ring-3 ring-astra shadow-xl scale-105'
                    : isRecommended
                    ? 'ring-2 ring-green-500/50 hover:ring-green-500'
                    : 'hover:ring-2 hover:ring-astra/50'
                }`}
              >
                <input
                  type="radio"
                  value={key}
                  {...register('material', { required: 'Please select a material' })}
                  className="sr-only"
                />
                
                <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  material === key
                    ? 'border-astra bg-astra/5 dark:bg-astra/10'
                    : isRecommended
                    ? 'border-green-500/50 bg-green-50/50 dark:bg-green-900/10'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}>
                  {/* Recommendation badge */}
                  {isRecommended && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Recommended
                    </div>
                  )}
                  
                  {/* Selection indicator */}
                  {material === key && (
                    <div className="absolute top-3 left-3 w-6 h-6 bg-astra rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Material visualization */}
                  <div className={`w-full h-3 bg-gradient-to-r ${option.color} rounded-lg mb-4`}></div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {option.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Composition:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{option.composition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cost Level:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{option.costLevel}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-semibold">Applications:</span> {option.applications.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.material && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.material.message}</p>
        )}
      </div>

      {/* Surface Finish Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inner Surface */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Inner Surface Finish
          </h3>
          <div className="space-y-4">
            {Object.entries(surfaceOptions.inner).map(([key, option]) => (
              <label
                key={key}
                className={`cursor-pointer block p-4 rounded-xl border-2 transition-all duration-200 ${
                  innerSurface === key
                    ? 'border-astra bg-astra/5 dark:bg-astra/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-astra/50'
                }`}
              >
                <input
                  type="radio"
                  value={key}
                  {...register('innerSurface', { required: 'Please select inner surface finish' })}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 mt-0.5 border-2 rounded-full flex items-center justify-center ${
                    innerSurface === key ? 'border-astra' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {innerSurface === key && (
                      <div className="w-2.5 h-2.5 bg-astra rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{option.title}</h4>
                      <span className="text-xs text-astra bg-astra/10 px-2 py-1 rounded-full">
                        Ra {option.ra}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {option.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {option.applications.join(', ')}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.innerSurface && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.innerSurface.message}</p>
          )}
        </div>

        {/* Outer Surface */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Outer Surface Treatment
          </h3>
          <div className="space-y-4">
            {Object.entries(surfaceOptions.outer).map(([key, option]) => (
              <label
                key={key}
                className={`cursor-pointer block p-4 rounded-xl border-2 transition-all duration-200 ${
                  outerSurface === key
                    ? 'border-astra bg-astra/5 dark:bg-astra/10'
                    : 'border-gray-300 dark:border-gray-600 hover:border-astra/50'
                }`}
              >
                <input
                  type="radio"
                  value={key}
                  {...register('outerSurface', { required: 'Please select outer surface treatment' })}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 mt-0.5 border-2 rounded-full flex items-center justify-center ${
                    outerSurface === key ? 'border-astra' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {outerSurface === key && (
                      <div className="w-2.5 h-2.5 bg-astra rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{option.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {option.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {option.applications.join(', ')}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.outerSurface && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.outerSurface.message}</p>
          )}
        </div>
      </div>

      {/* Material Summary */}
      {material && innerSurface && outerSurface && (
        <div className="bg-gradient-to-r from-astra/5 to-astra-soft/5 dark:from-astra/10 dark:to-astra-soft/10 rounded-2xl p-8 border border-astra/20">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Material Configuration Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-full h-2 bg-gradient-to-r ${materialOptions[material as keyof typeof materialOptions].color} rounded-lg mb-3`}></div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Material</h4>
              <p className="text-astra font-bold">{materialOptions[material as keyof typeof materialOptions].title}</p>
            </div>
            <div className="text-center">
              <div className="w-full h-2 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg mb-3"></div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Inner Finish</h4>
              <p className="text-astra font-bold">{surfaceOptions.inner[innerSurface as keyof typeof surfaceOptions.inner].title}</p>
            </div>
            <div className="text-center">
              <div className="w-full h-2 bg-gradient-to-r from-green-300 to-green-400 rounded-lg mb-3"></div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Outer Treatment</h4>
              <p className="text-astra font-bold">{surfaceOptions.outer[outerSurface as keyof typeof surfaceOptions.outer].title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialStep;
