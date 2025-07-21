import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import type { TankFormData } from '../../types/tankTypes';

const SpecificationsStep = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<TankFormData>();
  
  // Watch form values for automatic volume calculation
  const tankType = watch('tankType');
  const height = watch('height');
  const width = watch('width');
  const diameter = watch('diameter');
  const wallThickness = watch('wallThickness');
  const topType = watch('topType');
  const bottomType = watch('bottomType');
  
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
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Matmenys ir specifikacijos</h3>
        <p className="text-slate-400">Nurodykite tikslias rezervuaro dimensijas</p>
      </div>
      
      {/* Form Grid */}
      <div className="grid gap-6">
        {/* Height Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Aukštis (mm)
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Įveskite aukštį"
            {...register('height', { 
              required: 'Aukštis yra privalomas',
              min: { value: 100, message: 'Minimalus aukštis 100mm' },
              max: { value: 10000, message: 'Maksimalus aukštis 10,000mm' }
            })}
          />
          {errors.height && (
            <p className="text-sm text-red-400 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.height.message}</span>
            </p>
          )}
        </div>

        {/* Width/Diameter Input */}
        {tankType === 'cylindrical' ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Skersmuo (mm)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Įveskite skersmenį"
              {...register('diameter', { 
                required: 'Skersmuo yra privalomas',
                min: { value: 50, message: 'Minimalus skersmuo 50mm' },
                max: { value: 5000, message: 'Maksimalus skersmuo 5,000mm' }
              })}
            />
            {errors.diameter && (
              <p className="text-sm text-red-400 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errors.diameter.message}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Plotis (mm)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Įveskite plotį"
              {...register('width', { 
                required: 'Plotis yra privalomas',
                min: { value: 50, message: 'Minimalus plotis 50mm' },
                max: { value: 5000, message: 'Maksimalus plotis 5,000mm' }
              })}
            />
            {errors.width && (
              <p className="text-sm text-red-400 flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errors.width.message}</span>
              </p>
            )}
          </div>
        )}

        {/* Wall Thickness */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Sienelės storis (mm)
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Įveskite sienelės storį"
            {...register('wallThickness', { 
              required: 'Sienelės storis yra privalomas',
              min: { value: 0.5, message: 'Minimalus sienelės storis 0.5mm' },
              max: { value: 50, message: 'Maksimalus sienelės storis 50mm' }
            })}
          />
          {errors.wallThickness && (
            <p className="text-sm text-red-400 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errors.wallThickness.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Volume Display */}
      <div className="bg-slate-700 border border-slate-600 rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-astra-medium rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Skaičiuojamas tūris</h4>
              <p className="text-sm text-slate-400">Vidinis tūris be sienelių</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400">
              {watch('volume') ? `${watch('volume')}` : '0'}
            </div>
            <div className="text-sm text-slate-400">litrų</div>
          </div>
        </div>
      </div>

      {/* Material Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Medžiaga</h4>
        <div className="grid grid-cols-2 gap-4">
          <label className="relative">
            <input
              type="radio"
              value="304"
              className="peer sr-only"
              {...register('material', { required: 'Medžiaga yra privaloma' })}
            />
            <div className="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-all peer-checked:bg-astra-medium peer-checked:border-astra-light peer-checked:text-white hover:border-slate-500">
              <div className="text-center">
                <div className="font-semibold">304</div>
                <div className="text-sm text-slate-400 peer-checked:text-white">Nerūdijantis plienas</div>
              </div>
            </div>
          </label>

          <label className="relative">
            <input
              type="radio"
              value="316"
              className="peer sr-only"
              {...register('material', { required: 'Medžiaga yra privaloma' })}
            />
            <div className="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer transition-all peer-checked:bg-astra-medium peer-checked:border-astra-light peer-checked:text-white hover:border-slate-500">
              <div className="text-center">
                <div className="font-semibold">316</div>
                <div className="text-sm text-slate-400 peer-checked:text-white">Nerūdijantis plienas</div>
              </div>
            </div>
          </label>
        </div>
        {errors.material && (
          <p className="text-sm text-red-400 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{errors.material?.message}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SpecificationsStep;
