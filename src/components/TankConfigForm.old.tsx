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
      height: 1000, // 1000mm = 1m
      diameter: 500, // 500mm = 0.5m
      width: 500, // 500mm = 0.5m
      wallThickness: 3, // 3mm
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
    { id: 'tank-type', label: 'Talpos Tipas' },
    { id: 'specifications', label: 'Specifikacijos' },
    { id: 'orientation', label: 'Orientacija' },
    { id: 'top-bottom', label: 'Viršus/Apačia' },
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
    // If we're on the last step, submit the form
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
    // Here you would typically send the data to your backend
    console.log('Form submitted:', data);
    alert('Form submitted successfully! Check console for details.');
  };

  const formValues = methods.watch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Apple-style Hero Section */}
      <div className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-light tracking-tight text-gray-900 mb-6">
            Talpų Konfigūratorius
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed mb-16">
            Sukurkite idealią talpą su mūsų pažangiu 3D konfigūratorium.
            <br />
            <span className="text-gray-500">Paprastai. Greitai. Tiksliai.</span>
          </p>
        </div>
      </div>

      {/* Apple-style Navigation Steps */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <FormStepper steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content - Apple Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Form Section - Apple Card Style */}
          <div className="lg:col-span-5">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {/* Card with Apple-style blur effect */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl shadow-gray-900/10">
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                      <h2 className="text-2xl font-light text-gray-900">
                        {steps[currentStep].label}
                      </h2>
                    </div>
                  </div>
                  
                  {stepComponents[currentStep]}
                </div>
                
                {/* Apple-style Navigation */}
                <div className="mt-8 flex justify-between items-center">
                  <Button
                    label="← Atgal"
                    onClick={goToPrevStep}
                    variant="outline"
                    disabled={currentStep === 0}
                  />
                  <Button
                    label={currentStep === steps.length - 1 ? 'Baigti →' : 'Toliau →'}
                    onClick={goToNextStep}
                    type="button"
                  />
                </div>
              </form>
            </FormProvider>
          </div>
          
          {/* 3D Preview Section - Apple Studio Display Style */}
          <div className="lg:col-span-7">
            <div className="sticky top-8">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-3xl font-light text-gray-900 mb-2">Jūsų talpa</h3>
                <p className="text-lg text-gray-600 font-light">
                  Realaus laiko 3D peržiūra su visais nustatymais
                </p>
              </div>
              
              {/* Apple Studio Display-style Frame */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-100 via-white to-gray-100 rounded-[2.5rem] p-3 shadow-2xl shadow-gray-900/20">
                  <div className="bg-black rounded-[2rem] overflow-hidden relative">
                    <Tank3DPreview formData={formValues} />
                    
                    {/* Apple-style status indicator */}
                    <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">Live Preview</span>
                    </div>
                  </div>
                </div>
                
                {/* Apple-style caption */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 font-light">
                    Sukite ir artinkite pelės pagalba • Automatinis mastelio keitimas
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TankConfigForm;
