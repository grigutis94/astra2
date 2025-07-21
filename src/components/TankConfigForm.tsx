import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { TankFormData, FormStep } from '../types/tankTypes';
import FormStepper from './FormStepper';
import Button from './ui/Button';
import Tank3DPreview from './Tank3DPreview';
import ThemeToggle from './ThemeToggle';

// Import new step components
import PurposeStep from './steps/PurposeStep';
import DimensionsStep from './steps/DimensionsStep';
import MaterialStep from './steps/MaterialStep';
import AccessoriesStep from './steps/AccessoriesStep';
import SummaryStep from './steps/SummaryStep';

const TankConfigForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const methods = useForm<TankFormData>({
    defaultValues: {
      // Step 1: Purpose
      purpose: 'water',
      
      // Step 2: Core Dimensions
      tankType: 'cylindrical',
      height: 2000,
      diameter: 1000,
      width: 1000,
      wallThickness: 3,
      volume: 1.5,
      
      // Step 3: Material & Surface
      material: '304',
      innerSurface: 'standard',
      outerSurface: 'painted',
      
      // Step 4: Accessories
      accessories: {
        supportLegs: true,
        thermalInsulation: false,
        cipSystem: false,
        pressureRelief: false,
        levelIndicators: false,
        hatchesAndDrains: true,
      },
      
      // Legacy fields for 3D preview compatibility
      orientation: 'vertical',
      legs: 4,
      topType: 'flat',
      bottomType: 'flat',
      flangeCount: 0,
    },
    mode: 'onChange',
  });
  
  const steps: FormStep[] = [
    { id: 'purpose', label: 'Paskirtis' },
    { id: 'dimensions', label: 'Matmenys' },
    { id: 'material', label: 'Medžiaga' },
    { id: 'accessories', label: 'Priedai' },
    { id: 'summary', label: 'Suvestinė' },
  ];
  
  const stepComponents = [
    <PurposeStep key="purpose" />,
    <DimensionsStep key="dimensions" />,
    <MaterialStep key="material" />,
    <AccessoriesStep key="accessories" />,
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

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };
  
  const onSubmit = async (data: TankFormData) => {
    console.log('Form submitted:', data);
    alert('Tank configuration completed successfully!');
  };

  const formValues = methods.watch();

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Modern Header */}
        <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-astra to-astra-soft bg-clip-text text-transparent mb-3">
                  Tank Configurator
                </h1>
                <p className="text-slate-400 text-lg">Professional tank design made simple</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Progress Stepper */}
          <div className="mb-8">
            <FormStepper 
              steps={steps} 
              currentStep={currentStep} 
              onStepClick={handleStepClick}
            />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-8">
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                {/* Current Step Component */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-8">
                    {stepComponents[currentStep]}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={goToPrevStep}
                        disabled={currentStep === 0}
                        className="px-6 py-3"
                        label="Previous"
                      />
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Step {currentStep + 1} of {steps.length}
                        </span>
                        <div className="flex gap-1">
                          {steps.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index <= currentStep ? 'bg-astra' : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        onClick={goToNextStep}
                        className="px-6 py-3"
                        label={currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* 3D Preview Section */}
            <div className="lg:sticky lg:top-8 h-fit">
              <Tank3DPreview formData={formValues} />
              
              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume</p>
                  <p className="text-2xl font-bold text-astra">
                    {formValues.volume ? formValues.volume.toFixed(2) : '0.00'} m³
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Material</p>
                  <p className="text-lg font-bold text-astra">
                    {formValues.material ? `AISI ${formValues.material}` : 'Not selected'}
                  </p>
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
