import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import type { TankFormData } from '../../types/tankTypes';

const MaterialStep = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<TankFormData>();
  const { t, tString } = useTranslation();
  
  const purpose = watch('purpose');
  const material = watch('material');
  const innerSurface = watch('innerSurface');
  const outerSurface = watch('outerSurface');

  // Material options with detailed specifications
  const materialOptions = {
    '304': {
      title: t('materialStep.materials.304.title'),
      description: t('materialStep.materials.304.description'),
      applications: t('materialStep.materials.304.applications'),
      composition: t('materialStep.materials.304.composition'),
      costLevel: t('materialStep.materials.304.costLevel'),
      color: 'from-gray-300 to-gray-400',
      recommended: ['water']
    },
    '316': {
      title: t('materialStep.materials.316.title'),
      description: t('materialStep.materials.316.description'),
      applications: t('materialStep.materials.316.applications'),
      composition: t('materialStep.materials.316.composition'),
      costLevel: t('materialStep.materials.316.costLevel'),
      color: 'from-blue-300 to-blue-400',
      recommended: ['food', 'chemical']
    },
    'duplex': {
      title: t('materialStep.materials.duplex.title'),
      description: t('materialStep.materials.duplex.description'),
      applications: t('materialStep.materials.duplex.applications'),
      composition: t('materialStep.materials.duplex.composition'),
      costLevel: t('materialStep.materials.duplex.costLevel'),
      color: 'from-purple-300 to-purple-400',
      recommended: ['chemical']
    },
    'alloy': {
      title: t('materialStep.materials.alloy.title'),
      description: t('materialStep.materials.alloy.description'),
      applications: t('materialStep.materials.alloy.applications'),
      composition: t('materialStep.materials.alloy.composition'),
      costLevel: t('materialStep.materials.alloy.costLevel'),
      color: 'from-yellow-300 to-yellow-400',
      recommended: ['chemical']
    }
  };

  // Surface finish options
  const surfaceOptions = {
    inner: {
      polished: {
        title: t('materialStep.surfaces.inner.polished.title'),
        description: t('materialStep.surfaces.inner.polished.description'),
        ra: t('materialStep.surfaces.inner.polished.ra'),
        applications: t('materialStep.surfaces.inner.polished.applications')
      },
      standard: {
        title: t('materialStep.surfaces.inner.standard.title'),
        description: t('materialStep.surfaces.inner.standard.description'),
        ra: t('materialStep.surfaces.inner.standard.ra'),
        applications: t('materialStep.surfaces.inner.standard.applications')
      },
      brushed: {
        title: t('materialStep.surfaces.inner.brushed.title'),
        description: t('materialStep.surfaces.inner.brushed.description'),
        ra: t('materialStep.surfaces.inner.brushed.ra'),
        applications: t('materialStep.surfaces.inner.brushed.applications')
      }
    },
    outer: {
      painted: {
        title: t('materialStep.surfaces.outer.painted.title'),
        description: t('materialStep.surfaces.outer.painted.description'),
        applications: t('materialStep.surfaces.outer.painted.applications')
      },
      galvanized: {
        title: t('materialStep.surfaces.outer.galvanized.title'),
        description: t('materialStep.surfaces.outer.galvanized.description'),
        applications: t('materialStep.surfaces.outer.galvanized.applications')
      },
      'bare-steel': {
        title: t('materialStep.surfaces.outer.bare-steel.title'),
        description: t('materialStep.surfaces.outer.bare-steel.description'),
        applications: t('materialStep.surfaces.outer.bare-steel.applications')
      }
    }
  };

  // Auto-set recommended surfaces based on purpose and material (only set defaults if not already selected)
  useEffect(() => {
    if (purpose && material) {
      // Only set inner surface if it's not already selected
      if (purpose === 'food' && !innerSurface) {
        setValue('innerSurface', 'polished');
      } else if (purpose === 'chemical' && !innerSurface) {
        setValue('innerSurface', 'brushed');
      } else if (purpose === 'water' && !innerSurface) {
        setValue('innerSurface', 'standard');
      }

      // Only set outer surface if it's not already selected
      if (!outerSurface) {
        setValue('outerSurface', 'painted'); // Default to painted for protection
      }
    }
  }, [purpose, material, setValue]); // Removed innerSurface and outerSurface from dependencies

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
          {t('materialStep.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('materialStep.subtitle')}
        </p>
      </div>

      {/* Material Selection */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {t('materialStep.material')}
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
                  {...register('material', { required: tString('dimensionsStep.validation.selectMaterial') })}
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
                  
                  {/* Radio button indicator */}
                  <div className={`absolute top-3 left-3 w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                    material === key 
                      ? 'border-blue-500 bg-blue-500 shadow-lg' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }`}>
                    {material === key && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Material visualization */}
                  <div className={`w-full h-3 bg-gradient-to-r ${option.color} rounded-lg mb-4 mt-6`}></div>
                  
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
                        <span className="font-semibold">Applications:</span> {option.applications}
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
            {t('materialStep.innerSurface')}
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
                  {...register('innerSurface', { required: tString('dimensionsStep.validation.selectInnerSurface') })}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 mt-0.5 border-2 rounded-full flex items-center justify-center ${
                    innerSurface === key ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {innerSurface === key && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
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
                      {option.applications}
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
            {t('materialStep.outerSurface')}
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
                  {...register('outerSurface', { required: tString('dimensionsStep.validation.selectOuterSurface') })}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 mt-0.5 border-2 rounded-full flex items-center justify-center ${
                    outerSurface === key ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {outerSurface === key && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{option.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {option.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {option.applications}
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
