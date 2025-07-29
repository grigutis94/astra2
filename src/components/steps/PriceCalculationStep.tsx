import { useFormContext } from 'react-hook-form';
import type { TankFormData } from '../../types/tankTypes';
import PriceCalculation from '../PriceCalculation';

const PriceCalculationStep = () => {
  const { watch } = useFormContext<TankFormData>();
  const formValues = watch();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-dark mb-2">Kainos skaičiavimas</h2>
        <p className="text-muted">Preliminarus kainos apskaičiavimas pagal jūsų specifikacijas</p>
      </div>
      
      {/* Price Calculation Component */}
      <PriceCalculation formData={formValues} />
    </div>
  );
};

export default PriceCalculationStep;
