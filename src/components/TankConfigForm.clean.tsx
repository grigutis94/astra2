import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { TankFormData, FormStep } from '../types/tankTypes';
import FormStepper from './FormStepper';
import Button from './ui/Button';
import Tank3DPreview from './Tank3DPreview';

// Import Step Components
import TankTypeStep from './steps/TankTypeStep';
import SpecificationsStep from './steps/SpecificationsStep';
import OrientationStep from './steps/OrientationStep';
import TopBottomStep from './steps/TopBottomStep';
import FinalDetailsStep from './steps/FinalDetailsStep';
import SummaryStep from './steps/SummaryStep';

const TankConfigForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const methods = useForm<TankFormData>({
    defaultValues: {
      tankType: 'cylindrical',
      volume: 100,
      height: 1000,
      diameter: 500,
      width: 500,
      wallThickness: 3,
      material: '304',
      orientation: 'vertical',
      legs: 4,
      topType: 'flat',
      bottomType: 'flat',
      flangeCount: 0,
      purpose: 'water',
    },
    mode: 'onChange',
  });
  
  const steps: FormStep[] = [
    { id: 'tank-type', label: 'Tipas' },
    { id: 'specifications', label: 'Matmenys' },
    { id: 'orientation', label: 'Orientacija' },
    { id: 'top-bottom', label: 'Konstrukcija' },
    { id: 'final-details', label: 'Detalės' },
    { id: 'summary', label: 'Suvestinė' },
  ];
  
  const stepComponents = [
    <TankTypeStep key="tank-type" />,
    <SpecificationsStep key="specifications" />,
    <OrientationStep key="orientation" />,
    <TopBottomStep key="top-bottom" />,
    <FinalDetailsStep key="final-details" />,
    <SummaryStep key="summary" />,
  ];

  const goToNextStep = async () => {
    if (currentStep === steps.length - 1) {
      await onSubmit(methods.getValues());
      return;
    }
    
    const isValid = await methods.trigger();
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const onSubmit = async (data: TankFormData) => {
    console.log('Form submitted:', data);
    alert('Konfigūracija išsaugota sėkmingai!');
  };

  const formValues = methods.watch();

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Modern Header */}
        <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                Tank Configurator
              </h1>
              <p className="text-slate-400 text-lg">Sukurkite savo idealų rezervuarą</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Progress */}
          <div className="mb-8">
            <FormStepper steps={steps} currentStep={currentStep} />
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Form Panel - Takes 2/3 */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                {/* Panel Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">
                    {steps[currentStep].label}
                  </h2>
                  <p className="text-emerald-100 text-sm mt-1">
                    Žingsnis {currentStep + 1} iš {steps.length}
                  </p>
                </div>
                
                {/* Panel Content */}
                <div className="p-6">
                  {stepComponents[currentStep]}
                </div>
                
                {/* Panel Footer */}
                <div className="bg-slate-750 border-t border-slate-700 px-6 py-4 flex justify-between">
                  <Button
                    label="← Atgal"
                    variant="secondary"
                    onClick={goToPrevStep}
                    disabled={currentStep === 0}
                  />
                  <Button
                    label={currentStep === steps.length - 1 ? 'Užbaigti' : 'Toliau →'}
                    variant="primary"
                    onClick={goToNextStep}
                  />
                </div>
              </div>
            </div>

            {/* Preview Panel - Takes 1/3 */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden sticky top-8">
                {/* Preview Header */}
                <div className="bg-slate-750 px-6 py-4 border-b border-slate-700">
                  <h3 className="text-lg font-semibold text-white">3D Peržiūra</h3>
                  <p className="text-slate-400 text-sm">Realaus laiko vizualizacija</p>
                </div>
                
                {/* 3D View */}
                <div className="aspect-square bg-slate-900 relative">
                  <Tank3DPreview formData={formValues} />
                  
                  {/* Preview Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                      </div>
                      <p className="font-medium">3D modelis</p>
                      <p className="text-sm">Kraunasi...</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        {formValues.volume || 0}
                      </div>
                      <div className="text-slate-400 text-sm">Litrų</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        {formValues.material || '304'}
                      </div>
                      <div className="text-slate-400 text-sm">Medžiaga</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default TankConfigForm;
