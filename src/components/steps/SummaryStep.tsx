import { useFormContext } from 'react-hook-form';
import type { TankFormData } from '../../types/tankTypes';
import TechnicalDrawing from '../TechnicalDrawing';

const SummaryStep = () => {
  const { watch } = useFormContext<TankFormData>();
  const formValues = watch();
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Konfigūracijos santrauka</h2>
        <p className="text-slate-400">Peržiūrėkite visus pasirinkimus prieš užbaigdami</p>
      </div>
      
      <div className="bg-slate-700 p-8 rounded-2xl border border-slate-600">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-600">Pagrindiniai parametrai</h3>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-slate-300">Talpos tipas:</dt>
                <dd className="text-sm text-white font-medium bg-slate-600 px-3 py-1 rounded-lg capitalize">{formValues.tankType}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-slate-300">Tūris:</dt>
                <dd className="text-sm text-white font-medium bg-slate-600 px-3 py-1 rounded-lg">{formValues.volume} litrų</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-slate-300">Medžiaga:</dt>
                <dd className="text-sm text-white font-medium bg-slate-600 px-3 py-1 rounded-lg">Tipo {formValues.material} nerūdijantis plienas</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-slate-300">Paskirtis:</dt>
                <dd className="text-sm text-white font-medium bg-slate-600 px-3 py-1 rounded-lg capitalize">{formValues.purpose}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-600">Techniniai parametrai</h3>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-slate-300">Orientacija:</dt>
                <dd className="text-sm text-white font-medium bg-slate-600 px-3 py-1 rounded-lg capitalize">{formValues.orientation}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-slate-300">Kojų skaičius:</dt>
                <dd className="text-sm text-white font-medium bg-slate-600 px-3 py-1 rounded-lg">{formValues.legs || 0}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-slate-300">Flanšų skaičius:</dt>
                <dd className="text-sm text-white font-medium bg-slate-600 px-3 py-1 rounded-lg">{formValues.flangeCount || 0}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-600">
          <div className="bg-astra-light/20 border border-astra-medium/30 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Konfigūracija paruošta
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Jūsų talpos konfigūracija yra užbaigta ir paruošta gamybai. Visi parametrai atitinka technikės specifikacijas ir saugos reikalavimus.
            </p>
          </div>
        </div>
      </div>
      
      {/* Technical Drawing Section */}
      <div className="mt-8">
        <TechnicalDrawing formData={formValues} />
      </div>
    </div>
  );
};

export default SummaryStep;
