import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { TankFormData } from '../../types/tankTypes';

const AccessoriesStep = () => {
  const { register, watch, setValue } = useFormContext<TankFormData>();
  
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

  // Accessory options with detailed information
  const accessoryOptions = {
    supportLegs: {
      title: 'Support Legs / Stand',
      description: 'Structural support system to elevate the tank',
      icon: '🦵',
      benefits: ['Improved drainage', 'Easy maintenance access', 'Better stability'],
      applications: ['All tank types', 'Outdoor installations'],
      estimatedCost: 'Low',
      recommended: ['water', 'food', 'chemical'], // Recommended for all
      technical: 'Height-adjustable legs with anchor bolts'
    },
    thermalInsulation: {
      title: 'Thermal Insulation',
      description: 'Insulation jacket to maintain temperature and prevent condensation',
      icon: '🌡️',
      benefits: ['Temperature control', 'Energy efficiency', 'Condensation prevention'],
      applications: ['Temperature-sensitive storage', 'Outdoor installations'],
      estimatedCost: 'Medium',
      recommended: ['food', 'chemical'],
      technical: 'Polyurethane foam or mineral wool with protective cladding'
    },
    cipSystem: {
      title: 'CIP (Clean-In-Place) System',
      description: 'Automated cleaning system with spray balls and nozzles',
      icon: '🫧',
      benefits: ['Automated cleaning', 'Hygienic standards', 'Reduced downtime'],
      applications: ['Food processing', 'Pharmaceutical', 'Dairy'],
      estimatedCost: 'High',
      recommended: ['food'],
      technical: 'Rotating spray heads with controlled flow rates'
    },
    pressureRelief: {
      title: 'Pressure Relief / Venting',
      description: 'Safety valves and venting systems for pressure management',
      icon: '💨',
      benefits: ['Safety compliance', 'Pressure control', 'Vacuum prevention'],
      applications: ['Pressurized systems', 'Chemical storage', 'Safety-critical applications'],
      estimatedCost: 'Medium',
      recommended: ['chemical'],
      technical: 'Pressure relief valves, vacuum breakers, and flame arresters'
    },
    levelIndicators: {
      title: 'Liquid Level Indicators',
      description: 'Visual and electronic level monitoring systems',
      icon: '📏',
      benefits: ['Real-time monitoring', 'Inventory management', 'Overflow prevention'],
      applications: ['Process monitoring', 'Automated systems', 'Inventory control'],
      estimatedCost: 'Medium',
      recommended: ['water', 'food', 'chemical'], // Useful for all
      technical: 'Ultrasonic sensors, sight glasses, or float gauges'
    },
    hatchesAndDrains: {
      title: 'Hatches, Clamps, Drains',
      description: 'Access hatches, drain valves, and connection fittings',
      icon: '🚪',
      benefits: ['Easy access', 'Complete drainage', 'Maintenance convenience'],
      applications: ['All tank applications', 'Maintenance requirements'],
      estimatedCost: 'Low-Medium',
      recommended: ['water', 'food', 'chemical'], // Essential for all
      technical: 'Manways, tri-clamp connections, and sloped drain outlets'
    },
  };

  const getRecommendationLevel = (accessoryKey: string) => {
    const accessoryInfo = accessoryOptions[accessoryKey as keyof typeof accessoryOptions];
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
      const accessory = accessoryOptions[key as keyof typeof accessoryOptions];
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

    if (count === 0) return 'None';
    const avgCost = totalCostLevel / count;
    if (avgCost <= 1.2) return 'Low';
    if (avgCost <= 2) return 'Medium';
    return 'High';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Choose optional features
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Select accessories to enhance your tank's functionality for {purpose ? `${purpose} applications` : 'your specific needs'}
        </p>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(accessoryOptions).map(([key, option]) => {
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
                      Recommended
                    </div>
                  )}
                  <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    option.estimatedCost === 'Low' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : option.estimatedCost === 'Medium' || option.estimatedCost === 'Low-Medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {option.estimatedCost}
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
                    <h4 className="text-sm font-semibold text-astra">Key Benefits:</h4>
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
                      <span className="font-semibold">Technical:</span> {option.technical}
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
                Selected Accessories
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Object.values(accessories).filter(Boolean).length} accessories selected
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost Level</p>
              <p className={`text-lg font-bold ${
                getEstimatedCostForSelection() === 'Low' 
                  ? 'text-green-600 dark:text-green-400'
                  : getEstimatedCostForSelection() === 'Medium'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {getEstimatedCostForSelection()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(accessories).filter(([_, selected]) => selected).map(([key, _]) => {
              const option = accessoryOptions[key as keyof typeof accessoryOptions];
              return (
                <div key={key} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl">{option.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {option.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {option.estimatedCost} cost
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
          <p className="text-lg">No accessories selected</p>
          <p className="text-sm">You can add accessories to enhance your tank's functionality</p>
        </div>
      )}
    </div>
  );
};

export default AccessoriesStep;
