import { useFormContext } from 'react-hook-form';
import type { TankFormData } from '../../types/tankTypes';

const TankTypeStep = () => {
  const { register, formState: { errors } } = useFormContext<TankFormData>();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pasirinkite talpos tipą</h2>
        <p className="text-gray-600 dark:text-gray-300">Pasirinkite formą, kuri geriausiai atitiks jūsų poreikius</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative">
          <input
            type="radio"
            id="cylindrical"
            value="cylindrical"
            className="peer sr-only"
            {...register('tankType')}
          />
          <label
            htmlFor="cylindrical"
            className="flex flex-col items-center p-8 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
          >
            <div className="w-20 h-20 mb-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center peer-checked:bg-astra-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-500 dark:text-gray-300 peer-checked:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Cilindrinė</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">Optimali skysčiams ir dujoms. Geresnis slėgio pasiskirstymas</span>
          </label>
        </div>
        
        <div className="relative">
          <input
            type="radio"
            id="rectangular"
            value="rectangular"
            className="peer sr-only"
            {...register('tankType')}
          />
          <label
            htmlFor="rectangular"
            className="flex flex-col items-center p-8 bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/20 dark:peer-checked:bg-astra-medium/20"
          >
            <div className="w-20 h-20 mb-6 bg-gray-200 dark:bg-gray-600 rounded-2xl flex items-center justify-center peer-checked:bg-astra-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-500 dark:text-gray-300 peer-checked:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              </svg>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Stačiakampė</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">Erdvus saugojimas. Lengvai pritaikoma prie prostoros</span>
          </label>
        </div>
      </div>
      
      {errors.tankType && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2 mt-4">
          {errors.tankType.message}
        </p>
      )}
    </div>
  );
};

export default TankTypeStep;
