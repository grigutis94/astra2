import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { TankFormData } from '../../types/tankTypes';
import { useTranslation } from '../../contexts/LanguageContext';

const DimensionsStep = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<TankFormData>();
  const [showVolumeCalculation, setShowVolumeCalculation] = useState(false);
  const { t } = useTranslation();
  
  // Watch form values for automatic volume calculation and validation
  const purpose = watch('purpose');
  const tankType = watch('tankType');
  const height = watch('height');
  const width = watch('width');
  const diameter = watch('diameter');
  const wallThickness = watch('wallThickness');

  // Get purpose requirements for validation
  const purposeRequirements = {
    water: { minThickness: 3, maxThickness: 10 },
    food: { minThickness: 4, maxThickness: 12 },
    chemical: { minThickness: 6, maxThickness: 20 }
  };

  const currentRequirements = purpose ? purposeRequirements[purpose] : null;

  // Calculate volume automatically based on dimensions
  useEffect(() => {
    if (!height) return;
    
    let calculatedVolume = 0;
    const wallThick = wallThickness || 0;
    
    if (tankType === 'cylindrical' && diameter) {
      // Calculate inner dimensions by subtracting wall thickness
      const innerHeight = Math.max(0, height - (wallThick * 2)); // Top and bottom walls
      const innerDiameter = Math.max(0, diameter - (wallThick * 2)); // Side walls
      const innerRadius = innerDiameter / 2;
      
      // Base cylinder volume: π * r² * h (inner volume)
      calculatedVolume = Math.PI * Math.pow(innerRadius, 2) * innerHeight;
      
    } else if (tankType === 'rectangular' && width) {
      // Calculate inner dimensions by subtracting wall thickness
      const innerHeight = Math.max(0, height - (wallThick * 2));
      const innerWidth = Math.max(0, width - (wallThick * 2));
      const innerDepth = innerWidth; // Square base
      
      // Rectangular volume: w * h * d (inner volume)
      calculatedVolume = innerWidth * innerHeight * innerDepth;
    }
    
    // Convert from mm³ to m³ and update the form
    const volumeInM3 = calculatedVolume / 1000000000;
    setValue('volume', Math.round(volumeInM3 * 1000) / 1000); // Round to 3 decimal places
  }, [tankType, height, width, diameter, wallThickness, setValue]);

  const currentVolume = watch('volume');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('dimensionsStep.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('dimensionsStep.subtitle')}
        </p>
      </div>

      {/* Tank Type Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('dimensionsStep.shape')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
            tankType === 'cylindrical'
              ? 'border-astra bg-astra/5 dark:bg-astra/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-astra/50'
          }`}>
            <input
              type="radio"
              value="cylindrical"
              {...register('tankType', { required: t('dimensionsStep.validation.selectType') })}
              className="sr-only"
            />
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-astra/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-astra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('dimensionsStep.cylindrical.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('dimensionsStep.cylindrical.description')}</p>
            </div>
          </label>
          
          <label className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
            tankType === 'rectangular'
              ? 'border-astra bg-astra/5 dark:bg-astra/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-astra/50'
          }`}>
            <input
              type="radio"
              value="rectangular"
              {...register('tankType', { required: t('dimensionsStep.validation.selectType') })}
              className="sr-only"
            />
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-astra/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-astra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('dimensionsStep.rectangular.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('dimensionsStep.rectangular.description')}</p>
            </div>
          </label>
        </div>
        {errors.tankType && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2">{t('dimensionsStep.validation.selectType')}</p>
        )}
      </div>

      {/* Dimensions Input */}
      {tankType && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Height */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <label htmlFor="height" className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('common.height')} (mm)
            </label>
            <input
              type="number"
              id="height"
              min="100"
              max="20000"
              step="1"
              {...register('height', { 
                required: t('dimensionsStep.validation.heightRequired'),
                min: { value: 100, message: t('dimensionsStep.validation.heightMin').replace('{{min}}', '100') },
                max: { value: 20000, message: t('dimensionsStep.validation.heightMax').replace('{{max}}', '20,000') }
              })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-astra focus:border-astra transition-all duration-200"
              placeholder="e.g. 2000"
            />
            {errors.height && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.height.message}</p>
            )}
          </div>

          {/* Diameter or Width */}
          {tankType === 'cylindrical' ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <label htmlFor="diameter" className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('common.diameter')} (mm)
              </label>
              <input
                type="number"
                id="diameter"
                min="100"
                max="10000"
                step="1"
                {...register('diameter', { 
                  required: t('dimensionsStep.validation.diameterRequired'),
                  min: { value: 100, message: t('dimensionsStep.validation.diameterMin').replace('{{min}}', '100') },
                  max: { value: 10000, message: t('dimensionsStep.validation.diameterMax').replace('{{max}}', '10,000') }
                })}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-astra focus:border-astra transition-all duration-200"
                placeholder="e.g. 1000"
              />
              {errors.diameter && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.diameter.message}</p>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <label htmlFor="width" className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('common.width')} (mm)
              </label>
              <input
                type="number"
                id="width"
                min="100"
                max="10000"
                step="1"
                {...register('width', { 
                  required: t('dimensionsStep.validation.widthRequired'),
                  min: { value: 100, message: t('dimensionsStep.validation.widthMin').replace('{{min}}', '100') },
                  max: { value: 10000, message: t('dimensionsStep.validation.widthMax').replace('{{max}}', '10,000') }
                })}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-astra focus:border-astra transition-all duration-200"
                placeholder="e.g. 1000"
              />
              {errors.width && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.width.message}</p>
              )}
            </div>
          )}

          {/* Wall Thickness */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <label htmlFor="wallThickness" className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('dimensionsStep.wallThickness')}
            </label>
            <input
              type="number"
              id="wallThickness"
              min={currentRequirements?.minThickness || 1}
              max={currentRequirements?.maxThickness || 50}
              step="0.1"
              {...register('wallThickness', { 
                required: t('dimensionsStep.validation.thicknessRequired'),
                min: { 
                  value: currentRequirements?.minThickness || 1, 
                  message: t('dimensionsStep.validation.thicknessMin')
                    .replace('{{min}}', String(currentRequirements?.minThickness || 1))
                    .replace('{{purpose}}', purpose || 'this')
                },
                max: { 
                  value: currentRequirements?.maxThickness || 50, 
                  message: t('dimensionsStep.validation.thicknessMax')
                    .replace('{{max}}', String(currentRequirements?.maxThickness || 50))
                }
              })}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-astra focus:border-astra transition-all duration-200"
              placeholder={`Min: ${currentRequirements?.minThickness || 1}mm`}
            />
            {currentRequirements && (
              <p className="text-xs text-astra mt-2">
                {t('common.recommended')} {purpose}: {currentRequirements.minThickness}-{currentRequirements.maxThickness}mm
              </p>
            )}
            {errors.wallThickness && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.wallThickness.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Volume Display */}
      {currentVolume && currentVolume > 0 && (
        <div className="bg-gradient-to-r from-astra/5 to-astra-soft/5 dark:from-astra/10 dark:to-astra-soft/10 rounded-2xl p-8 border border-astra/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('dimensionsStep.calculatedVolume')}
              </h3>
              <p className="text-3xl font-bold text-astra">
                {currentVolume.toFixed(3)} m³
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                = {(currentVolume * 1000).toFixed(0)} {t('common.volume').toLowerCase()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVolumeCalculation(!showVolumeCalculation)}
              className="text-sm text-astra hover:text-astra-dark transition-colors duration-200 flex items-center gap-2"
            >
              {showVolumeCalculation ? t('dimensionsStep.hideCalculation') : t('dimensionsStep.showCalculation')}
              <svg className={`w-4 h-4 transition-transform duration-200 ${showVolumeCalculation ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {showVolumeCalculation && (
            <div className="mt-6 pt-6 border-t border-astra/20">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('dimensionsStep.volumeCalculation')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{t('dimensionsStep.formula')}</span>{' '}
                    {tankType === 'cylindrical' 
                      ? 'π × r² × h (' + t('dimensionsStep.innerDimensions') + ')' 
                      : 'w × h × d (' + t('dimensionsStep.innerDimensions') + ')'
                    }
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{t('dimensionsStep.wallThicknessDeduction')}</span> {wallThickness}mm {t('dimensionsStep.onAllSides')}
                  </p>
                </div>
                <div className="space-y-2">
                  {tankType === 'cylindrical' ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('dimensionsStep.innerDiameter')}: {diameter && wallThickness ? (diameter - wallThickness * 2).toFixed(1) : 0}mm
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('dimensionsStep.innerHeight')}: {height && wallThickness ? (height - wallThickness * 2).toFixed(1) : 0}mm
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('dimensionsStep.innerWidth')}: {width && wallThickness ? (width - wallThickness * 2).toFixed(1) : 0}mm
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('dimensionsStep.innerHeight')}: {height && wallThickness ? (height - wallThickness * 2).toFixed(1) : 0}mm
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DimensionsStep;
