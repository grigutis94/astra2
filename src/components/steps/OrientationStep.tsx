import { useFormContext } from 'react-hook-form';
import type { TankFormData } from '../../types/tankTypes';

const OrientationStep = () => {
  const { register, formState: { errors } } = useFormContext<TankFormData>();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Talpos orientacija</h2>
        <p className="text-slate-400">Pasirinkite talpos padėtį ir papildomus elementus</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-4">
            Orientacija
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="radio"
                id="vertical"
                value="vertical"
                className="peer sr-only"
                {...register('orientation')}
              />
              <label
                htmlFor="vertical"
                className="flex flex-col items-center p-8 bg-slate-700 border-2 border-slate-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-slate-600 hover:border-slate-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/10 dark:peer-checked:bg-astra-medium/10"
              >
                <div className="w-20 h-20 mb-6 bg-slate-600 rounded-2xl flex items-center justify-center peer-checked:bg-astra-medium">
                  <span className="text-4xl text-slate-300 peer-checked:text-white rotate-0">⬆</span>
                </div>
                <span className="font-semibold text-white text-lg mb-2">Vertikali</span>
                <span className="text-sm text-slate-400 text-center leading-relaxed">Taupomas plotas. Tinka aukštiems pastatams</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="radio"
                id="horizontal"
                value="horizontal"
                className="peer sr-only"
                {...register('orientation')}
              />
              <label
                htmlFor="horizontal"
                className="flex flex-col items-center p-8 bg-slate-700 border-2 border-slate-600 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-slate-600 hover:border-slate-500 peer-checked:border-astra-medium peer-checked:bg-astra-light/10 dark:peer-checked:bg-astra-medium/10"
              >
                <div className="w-20 h-20 mb-6 bg-slate-600 rounded-2xl flex items-center justify-center peer-checked:bg-astra-medium">
                  <span className="text-4xl text-slate-300 peer-checked:text-white rotate-90">⬆</span>
                </div>
                <span className="font-semibold text-white text-lg mb-2">Horizontali</span>
                <span className="text-sm text-slate-400 text-center leading-relaxed">Stabilesnis. Lengvesnis priežiūra</span>
              </label>
            </div>
          </div>
          {errors.orientation && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2 mt-4">
              {errors.orientation.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="legs" className="block text-sm font-semibold text-slate-300 mb-3">
            Kojų skaičius
          </label>
          <select
            id="legs"
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-astra-soft focus:border-astra-soft transition-all duration-200"
            {...register('legs')}
          >
            <option value={0}>Be kojų (ant pagrindo)</option>
            <option value={3}>3 kojos</option>
            <option value={4}>4 kojos</option>
            <option value={6}>6 kojos</option>
            <option value={8}>8 kojos</option>
          </select>
          {errors.legs && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-700 rounded-lg px-4 py-2 mt-3">
              {errors.legs.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrientationStep;
