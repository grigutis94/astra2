import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { TankFormData, FormStep } from '../types/tankTypes';
import FormStepper from './FormStepper';
import Button from './ui/Button';
// import Enhanced3DTankPreview from './Enhanced3DTankPreview'; // Laikinai išjungiu
import Tank3DPreview from './Tank3DPreview'; // Laikinai naudoju senąjį komponentą
import { useTranslation } from '../contexts/LanguageContext';

// Import new step components
import PurposeStep from './steps/PurposeStep';
import DimensionsStep from './steps/DimensionsStep';
import MaterialStep from './steps/MaterialStep';
import AccessoriesStep from './steps/AccessoriesStep';
import PriceCalculationStep from './steps/PriceCalculationStep';
import SummaryStep from './steps/SummaryStep';

const TankConfigForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tankTransparency, setTankTransparency] = useState(1.0); // 1.0 = fully opaque, 0.1 = most transparent
  const { t, tString } = useTranslation();
  
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
      
      // Step 4: Accessories - All unselected by default (EXPANDED)
      accessories: {
        supportLegs: false,
        thermalInsulation: false,
        cipSystem: false,
        pressureRelief: false,
        levelIndicators: false,
        hatchesAndDrains: false,
        // New accessories - default to false
        flanges: false,
        agitators: false,
        ladders: false,
        sensors: false,
      },
      
      // Accessory sizes - default to normal (EXPANDED)
      accessorySize: {
        supportLegs: 'normal',
        thermalInsulation: 'normal',
        cipSystem: 'normal',
        pressureRelief: 'normal',
        levelIndicators: 'normal',
        hatchesAndDrains: 'normal',
        // New accessory sizes
        flanges: 'normal',
        agitators: 'normal',
        ladders: 'normal',
        sensors: 'normal',
      },
      
      // Legacy fields for 3D preview compatibility
      orientation: 'vertical',
      legs: 0, // No legs by default - tank sits on ground
      topType: 'flat',
      bottomType: 'flat',
      flangeCount: 0,
    },
    mode: 'onChange',
  });
  
  const steps: FormStep[] = [
    { id: 'purpose', label: tString('stepper.step1') },
    { id: 'dimensions', label: tString('stepper.step2') },
    { id: 'material', label: tString('stepper.step3') },
    { id: 'accessories', label: tString('stepper.step4') },
    { id: 'pricing', label: 'Kainos skaičiavimas' },
    { id: 'summary', label: tString('stepper.step5') },
  ];
  
  const stepComponents = [
    <PurposeStep key="purpose" />,
    <DimensionsStep key="dimensions" />,
    <MaterialStep key="material" />,
    <AccessoriesStep key="accessories" />,
    <PriceCalculationStep key="pricing" />,
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
   // alert('Tank configuration completed successfully!');
  };

  const formValues = methods.watch();
  
  // Debug: log form values changes
  useEffect(() => {
    console.log('Form values changed:', formValues);
  }, [formValues]);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-neutral-light text-neutral-dark">

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
          <div className={`grid gap-8 ${currentStep === 4 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Form Section */}
            <div className="space-y-8">
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                {/* Current Step Component */}
                <div className="card">
                  <div className="p-8">
                    {stepComponents[currentStep]}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="px-8 py-6 bg-neutral-light border-t border-border-primary">
                    <div className="flex justify-between items-center">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={goToPrevStep}
                        disabled={currentStep === 0}
                        className="px-6 py-3"
                        label={tString('common.previous')}
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
                        label={currentStep === steps.length - 1 ? tString('common.finish') : tString('common.next')}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* 3D Preview Section - Hide during price calculation step */}
            {currentStep !== 4 && (
              <div className="lg:sticky lg:top-8 h-fit">
                <Tank3DPreview formData={formValues} transparency={tankTransparency} />
                
                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="card p-4 text-center">
                    <p className="text-sm text-muted mb-1">{t('preview.volume')}</p>
                    <p className="text-2xl font-bold text-neutral-dark">
                      {formValues.volume ? formValues.volume.toFixed(2) : '0.00'} m³
                    </p>
                  </div>
                  <div className="card p-4 text-center">
                    <p className="text-sm text-muted mb-1">{t('preview.material')}</p>
                    <p className="text-lg font-bold text-neutral-dark">
                      {formValues.material ? `AISI ${formValues.material}` : t('common.select')}
                    </p>
                  </div>
                </div>
                
                {/* Transparency Control */}
                <div className="mt-4 card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary-blue rounded-full"></div>
                      <p className="text-sm font-semibold text-neutral-dark">{t('preview.transparency.label')}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-light px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-primary-blue rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-primary-blue">
                        {Math.round((1 - tankTransparency) * 100)}{t('preview.transparency.percentage')}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-muted w-20 text-center">
                        {t('preview.transparency.opaque')}
                      </span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0"
                          max="90"
                          step="5"
                          value={Math.round((1 - tankTransparency) * 100)}
                          onChange={(e) => setTankTransparency(1 - (parseFloat(e.target.value) / 100))}
                          className="w-full h-3 bg-gradient-to-r from-neutral-light via-primary-blue to-accent-orange rounded-lg appearance-none cursor-pointer
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                                     [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                                     [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-blue
                                     [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                                     [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                                     [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz	range-thumb]:border-2
                                     [&::-moz	range-thumb]:border-primary-blue [&::-moz	range-thumb]:shadow-lg"
                        />
                        {/* Slider track indicators */}
                        <div className="absolute top-4 left-0 right-0 flex justify-between px-1">
                          {[0, 25, 50, 75, 90].map((value) => (
                            <div key={value} className="flex flex-col items-center">
                              <div className="w-0.5 h-2 bg-border-secondary"></div>
                              <span className="text-xs text-muted mt-1">{value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted w-20 text-center">
                        {t('preview.transparency.transparent')}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted leading-relaxed">
                        {t('preview.transparency.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default TankConfigForm;
