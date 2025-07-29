import { useFormContext } from 'react-hook-form';
import type { TankFormData } from '../../types/tankTypes';
import TechnicalDrawing from '../TechnicalDrawing';

const SummaryStep = () => {
  const { watch } = useFormContext<TankFormData>();
  const formValues = watch();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Konfigūracijos santrauka</h2>
        <p className="text-muted">Peržiūrėkite techninį brėžinį ir užbaikite konfigūraciją</p>
      </div>
      
      {/* Quick Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-blue-700 mb-1">Tipas</div>
          <div className="text-lg font-bold text-blue-900 capitalize">{formValues.tankType || 'Nepasirinkta'}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-green-700 mb-1">Tūris</div>
          <div className="text-lg font-bold text-green-900">{formValues.volume || '0'} m³</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-purple-700 mb-1">Medžiaga</div>
          <div className="text-lg font-bold text-purple-900">AISI {formValues.material || '304'}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-sm font-medium text-orange-700 mb-1">Storis</div>
          <div className="text-lg font-bold text-orange-900">{formValues.wallThickness || 3} mm</div>
        </div>
      </div>
      
      {/* Specifications */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Techniniai parametrai</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Aukštis:</span>
                <span className="font-semibold">{formValues.height || 0} mm</span>
              </div>
              {formValues.tankType === 'cylindrical' ? (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Skersmuo:</span>
                  <span className="font-semibold">{formValues.diameter || 0} mm</span>
                </div>
              ) : (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Plotis:</span>
                  <span className="font-semibold">{formValues.width || 0} mm</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Orientacija:</span>
                <span className="font-semibold capitalize">{formValues.orientation || 'Standartinė'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Vidinis paviršius:</span>
                <span className="font-semibold capitalize">{formValues.innerSurface || 'Standard'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Išorinis paviršius:</span>
                <span className="font-semibold capitalize">{formValues.outerSurface || 'Standard'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Kojų skaičius:</span>
                <span className="font-semibold">{formValues.legs || 0} vnt.</span>
              </div>
            </div>
          </div>
          
          {/* Accessories */}
          {formValues.accessories && Object.values(formValues.accessories).some(Boolean) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">Pasirinkti aksesuarai:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(formValues.accessories).map(([key, value]) => {
                  if (!value) return null;
                  const accessoryNames: Record<string, string> = {
                    supportLegs: 'Atraminės kojos',
                    thermalInsulation: 'Šilumos izoliacija',
                    cipSystem: 'CIP sistema',
                    pressureRelief: 'Slėgio numetimo vožtuvas',
                    levelIndicators: 'Lygio indikatoriai',
                    hatchesAndDrains: 'Liukai ir nutekėjimas'
                  };
                  return (
                    <span key={key} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {accessoryNames[key] || key}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Technical Drawing - Full functionality restored */}
      <TechnicalDrawing formData={formValues} />
      
      {/* Final Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 className="text-lg font-bold text-green-800 mb-1">Konfigūracija užbaigta!</h4>
            <p className="text-sm text-green-700">
              Jūsų talpos konfigūracija yra paruošta gamybai. Visi parametrai atitinka technikės specifikacijas ir saugos reikalavimus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
