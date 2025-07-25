import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import type { TankFormData } from '../../types/tankTypes';

const AccessoriesStep = () => {
  const { register, watch, setValue } = useFormContext<TankFormData>();
  const { t, tString } = useTranslation();
  
  const purpose = watch('purpose');
  const accessories = watch('accessories') || {};

  // Initialize accessories if not set
  useEffect(() => {
    if (!accessories || Object.keys(accessories).length === 0) {
      setValue('accessories', {
        supportLegs: false,
        thermalInsulation: false,
        cipSystem: false,
        pressureRelief: false,
        levelIndicators: false,
        hatchesAndDrains: false,
      });
    }
  }, [accessories, setValue]);

  // Helper function to get accessory info with translations
  const getAccessoryInfo = (accessoryKey: string) => {
    const icons: { [key: string]: string } = {
      supportLegs: '🦵',
      thermalInsulation: '🌡️',
      cipSystem: '🫧',
      pressureRelief: '💨',
      levelIndicators: '📏',
      hatchesAndDrains: '🚪',
    };

    const costs: { [key: string]: string } = {
      supportLegs: 'Low',
      thermalInsulation: 'Medium',
      cipSystem: 'High',
      pressureRelief: 'Medium',
      levelIndicators: 'Medium',
      hatchesAndDrains: 'Low-Medium',
    };

    const recommended: { [key: string]: string[] } = {
      supportLegs: ['water', 'food', 'chemical'],
      thermalInsulation: ['food', 'chemical'],
      cipSystem: ['food'],
      pressureRelief: ['chemical'],
      levelIndicators: ['water', 'food', 'chemical'],
      hatchesAndDrains: ['water', 'food', 'chemical'],
    };

    const benefits = t(`accessoriesStep.accessories.${accessoryKey}.benefits`);
    const applications = t(`accessoriesStep.accessories.${accessoryKey}.applications`);

    return {
      title: t(`accessoriesStep.accessories.${accessoryKey}.title`) as string,
      description: t(`accessoriesStep.accessories.${accessoryKey}.description`) as string,
      icon: icons[accessoryKey] || '📦',
      benefits: Array.isArray(benefits) ? benefits : [benefits as string],
      applications: Array.isArray(applications) ? applications : [applications as string],
      estimatedCost: costs[accessoryKey] || 'Medium',
      recommended: recommended[accessoryKey] || [],
      technical: t(`accessoriesStep.accessories.${accessoryKey}.technical`) as string
    };
  };

  const accessoryKeys = ['supportLegs', 'thermalInsulation', 'cipSystem', 'pressureRelief', 'levelIndicators', 'hatchesAndDrains'];

  const getRecommendationLevel = (accessoryKey: string) => {
    const accessoryInfo = getAccessoryInfo(accessoryKey);
    if (purpose && accessoryInfo.recommended.includes(purpose)) {
      return 'highly-recommended';
    }
    return 'optional';
  };

  const getEstimatedCostForSelection = () => {
    const selectedAccessories = Object.entries(accessories).filter(([_, selected]) => selected);
    let totalCostLevel = 0;
    let count = 0;

    selectedAccessories.forEach(([key, _]) => {
      const accessory = getAccessoryInfo(key);
      if (accessory) {
        switch (accessory.estimatedCost) {
          case 'Low': totalCostLevel += 1; break;
          case 'Low-Medium': totalCostLevel += 1.5; break;
          case 'Medium': totalCostLevel += 2; break;
          case 'High': totalCostLevel += 3; break;
        }
        count++;
      }
    });

    if (count === 0) return t('accessoriesStep.costLevels.None');
    const avgCost = totalCostLevel / count;
    if (avgCost <= 1.2) return t('accessoriesStep.costLevels.Low');
    if (avgCost <= 2) return t('accessoriesStep.costLevels.Medium');
    return t('accessoriesStep.costLevels.High');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('accessoriesStep.title')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('accessoriesStep.subtitle')}
        </p>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accessoryKeys.map((key) => {
          const option = getAccessoryInfo(key);
          const recommendationLevel = getRecommendationLevel(key);
          const isRecommended = recommendationLevel === 'highly-recommended';
          const isSelected = accessories[key as keyof typeof accessories];
          
          return (
            <label
              key={key}
              className={`relative cursor-pointer group transition-all duration-300 transform hover:scale-102 ${
                isSelected
                  ? 'ring-3 ring-astra shadow-xl scale-102'
                  : isRecommended
                  ? 'ring-2 ring-green-500/50 hover:ring-green-500'
                  : 'hover:ring-2 hover:ring-astra/50'
              }`}
            >
              <input
                type="checkbox"
                {...register(`accessories.${key}` as any)}
                className="sr-only"
              />
              
              <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-astra bg-astra/5 dark:bg-astra/10'
                  : isRecommended
                  ? 'border-green-500/50 bg-green-50/50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}>
                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {isRecommended && (
                    <div className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      {t('accessoriesStep.recommended')}
                    </div>
                  )}
                  <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    option.estimatedCost === 'Low' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : option.estimatedCost === 'Medium' || option.estimatedCost === 'Low-Medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {t(`accessoriesStep.costLevels.${option.estimatedCost}`)}
                  </div>
                </div>
                
                {/* Selection indicator - Radio button style */}
                <div className={`absolute top-3 left-3 w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-500 shadow-lg' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                }`}>
                  {isSelected && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="pt-8 space-y-4">
                  {/* Icon and Title */}
                  <div className="text-center">
                    <div className="text-4xl mb-3">{option.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Benefits */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-astra">{t('accessoriesStep.benefits')}:</h4>
                    <ul className="space-y-1">
                      {option.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-astra-soft rounded-full mt-2 flex-shrink-0"></div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Technical Info */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      <span className="font-semibold">{t('accessoriesStep.technical')}:</span> {option.technical}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Selection Summary */}
      {accessories && Object.values(accessories).some(Boolean) && (
        <div className="bg-gradient-to-r from-astra/5 to-astra-soft/5 dark:from-astra/10 dark:to-astra-soft/10 rounded-2xl p-8 border border-astra/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('accessoriesStep.summary.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Object.values(accessories).filter(Boolean).length} {t('accessoriesStep.summary.selectedCount')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('accessoriesStep.summary.totalCost')}</p>
              <p className={`text-lg font-bold ${
                getEstimatedCostForSelection() === t('accessoriesStep.costLevels.Low')
                  ? 'text-green-600 dark:text-green-400'
                  : getEstimatedCostForSelection() === t('accessoriesStep.costLevels.Medium')
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {getEstimatedCostForSelection()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(accessories).filter(([_, selected]) => selected).map(([key, _]) => {
              const option = getAccessoryInfo(key);
              return (
                <div key={key} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl">{option.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {option.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t(`accessoriesStep.costLevels.${option.estimatedCost}`)} {tString('accessoriesStep.estimatedCost').toLowerCase()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No accessories selected message */}
      {accessories && !Object.values(accessories).some(Boolean) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-lg">{t('accessoriesStep.summary.noAccessories')}</p>
          <p className="text-sm">{t('accessoriesStep.summary.noAccessoriesDescription')}</p>
        </div>
      )}
    </div>
  );
};

export default AccessoriesStep;
