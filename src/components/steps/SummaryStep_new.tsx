import { useFormContext } from 'react-hook-form';
import type { TankFormData } from '../../types/tankTypes';
import TechnicalDrawing from '../TechnicalDrawing';

const SummaryStep = () => {
  const { watch } = useFormContext<TankFormData>();
  const formValues = watch();
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Konfigūracijos santrauka</h2>
        <p className="text-muted">Peržiūrėkite visus pasirinkimus prieš užbaigdami</p>
      </div>
      
      <div className="card p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-neutral-dark mb-6 pb-3 border-b border-border-primary">Pagrindiniai parametrai</h3>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-muted">Talpos tipas:</dt>
                <dd className="badge badge-info capitalize">{formValues.tankType}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-muted">Tūris:</dt>
                <dd className="badge badge-info">{formValues.volume} litrų</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-muted">Medžiaga:</dt>
                <dd className="badge badge-info">Tipo {formValues.material} nerūdijantis plienas</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-muted">Paskirtis:</dt>
                <dd className="badge badge-info capitalize">{formValues.purpose}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-neutral-dark mb-6 pb-3 border-b border-border-primary">Techniniai parametrai</h3>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-muted">Orientacija:</dt>
                <dd className="badge badge-info capitalize">{formValues.orientation}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-muted">Kojų skaičius:</dt>
                <dd className="badge badge-info">{formValues.legs || 0}</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-sm font-semibold text-muted">Flanšų skaičius:</dt>
                <dd className="badge badge-info">{formValues.flangeCount || 0}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border-primary">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-neutral-dark mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pasirinktys patvirtintos
            </h4>
          </div>
          
          <div className="bg-success-light p-6 rounded-lg border border-highlight-green/20">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-highlight-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h5 className="text-lg font-semibold text-neutral-dark">Konfigūracija užbaigta!</h5>
                <p className="text-muted">Visi parametrai nustatyti ir talpa paruošta gamybai.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TechnicalDrawing />
    </div>
  );
};

export default SummaryStep;
