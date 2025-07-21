import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { TankFormData } from '../../types/tankTypes';

const TopBottomStep = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<TankFormData>();
  const tankType = watch('tankType');
  const orientation = watch('orientation');
  
  // Watch all values needed for volume calculation
  const height = watch('height');
  const width = watch('width');
  const diameter = watch('diameter');
  const wallThickness = watch('wallThickness');
  const topType = watch('topType');
  const bottomType = watch('bottomType');
  
  // Calculate volume automatically when top/bottom types change
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
      
      // Add/subtract volume for top and bottom shapes
      const sphereVolume = (4/3) * Math.PI * Math.pow(innerRadius, 3) / 2; // Half sphere
      const coneVolume = (1/3) * Math.PI * Math.pow(innerRadius, 2) * innerRadius; // Cone height = radius
      
      // Adjust for top type
      if (topType === 'dome') {
        calculatedVolume += sphereVolume; // Add dome volume
      } else if (topType === 'cone') {
        calculatedVolume += coneVolume; // Add cone volume
      }
      
      // Adjust for bottom type  
      if (bottomType === 'dome') {
        calculatedVolume += sphereVolume; // Add dome volume (dished bottom adds extra volume)
      } else if (bottomType === 'cone') {
        calculatedVolume += coneVolume; // Add cone volume (cone extends below tank)
      }
    } else if (tankType === 'rectangular' && width) {
      // Calculate inner dimensions by subtracting wall thickness
      const innerHeight = Math.max(0, height - (wallThick * 2)); // Top and bottom walls
      const innerWidth = Math.max(0, width - (wallThick * 2)); // Side walls
      
      // Volume for rectangular: width * width * height (inner volume, assuming square base)
      calculatedVolume = innerWidth * innerWidth * innerHeight;
    }
    
    // Convert from cubic mm to liters (1 liter = 1,000,000 cubic mm)
    const volumeInLiters = calculatedVolume / 1000000;
    
    if (volumeInLiters > 0) {
      setValue('volume', Math.round(volumeInLiters * 100) / 100); // Round to 2 decimal places
    } else {
      setValue('volume', 0);
    }
  }, [tankType, height, width, diameter, wallThickness, topType, bottomType, setValue]);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Viršaus ir apačios konfigūracija</h2>
        <p className="text-gray-600 dark:text-gray-300">Pasirinkite rezervuaro dangčių tipą</p>
      </div>
      
      {tankType === 'cylindrical' && (
        <div className="space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {orientation === 'vertical' ? 'Viršaus dangčio tipas' : 'Priekinio dangčio tipas'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="relative">
                <input
                  type="radio"
                  id="flat-top"
                  value="flat"
                  className="peer sr-only"
                  {...register('topType')}
                />
                <label
                  htmlFor="flat-top"
                  className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
                >
                  <div className="w-20 h-20 mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center peer-checked:bg-astra-medium">
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-300 peer-checked:text-white">━</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Plokščias</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">Standartinis</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="dome-top"
                  value="dome"
                  className="peer sr-only"
                  {...register('topType')}
                />
                <label
                  htmlFor="dome-top"
                  className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
                >
                  <div className="w-20 h-20 mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center peer-checked:bg-astra-medium">
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-300 peer-checked:text-white">⌒</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Kupolas</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">Spaudimui</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="cone-top"
                  value="cone"
                  className="peer sr-only"
                  {...register('topType')}
                />
                <label
                  htmlFor="cone-top"
                  className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
                >
                  <div className="w-20 h-20 mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center peer-checked:bg-astra-medium">
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-300 peer-checked:text-white">△</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Kūgis</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">Nutekėjimui</span>
                </label>
              </div>
            </div>
            {errors.topType && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.topType.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {orientation === 'vertical' ? 'Apačios dangčio tipas' : 'Galinio dangčio tipas'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="relative">
                <input
                  type="radio"
                  id="flat-bottom"
                  value="flat"
                  className="peer sr-only"
                  {...register('bottomType')}
                />
                <label
                  htmlFor="flat-bottom"
                  className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
                >
                  <div className="w-20 h-20 mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center peer-checked:bg-astra-medium">
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-300 peer-checked:text-white">━</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Plokščias</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">Standartinis</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="dome-bottom"
                  value="dome"
                  className="peer sr-only"
                  {...register('bottomType')}
                />
                <label
                  htmlFor="dome-bottom"
                  className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
                >
                  <div className="w-20 h-20 mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center peer-checked:bg-astra-medium">
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-300 peer-checked:text-white">⌒</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Kupolas</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">Spaudimui</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  id="cone-bottom"
                  value="cone"
                  className="peer sr-only"
                  {...register('bottomType')}
                />
                <label
                  htmlFor="cone-bottom"
                  className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
                >
                  <div className="w-20 h-20 mb-4 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center peer-checked:bg-astra-medium">
                    <span className="text-4xl font-bold text-gray-500 dark:text-gray-300 peer-checked:text-white">▼</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Kūgis</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 text-center">Ištuštinimui</span>
                </label>
              </div>
            </div>
            {errors.bottomType && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.bottomType.message}</p>
            )}
          </div>
        </div>
      )}
      
      {tankType === 'rectangular' && (
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400">Stačiakampiai rezervuarai</h3>
          </div>
          <p className="text-amber-700 dark:text-amber-300">
            Stačiakampiai rezervuarai paprastai turi plokščius viršus ir apačias. 
            Papildoma konfigūracija nereikalinga.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopBottomStep;
