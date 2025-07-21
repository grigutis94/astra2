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
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Talpų Konfigūratorius</h1>
          <p className="text-gray-600">Sukurkite savo idealią talpą</p>
        </div>

        {/* Main Container - Fixed Width */}
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="mb-8">
            <FormStepper steps={steps} currentStep={currentStep} />
          </div>

          {/* Content Grid - Simple 2 Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Form Column */}
            <div className="space-y-6">
              {/* Form Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium text-gray-900">{steps[currentStep].label}</h2>
                  <p className="text-sm text-gray-500 mt-1">Žingsnis {currentStep + 1} iš {steps.length}</p>
                </div>
                
                {stepComponents[currentStep]}
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  label="Atgal"
                  variant="secondary"
                  onClick={goToPrevStep}
                  disabled={currentStep === 0}
                />
                
                <div className="flex space-x-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep
                          ? 'bg-blue-500'
                          : index < currentStep
                          ? 'bg-blue-400'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  label={currentStep === steps.length - 1 ? 'Užbaigti' : 'Toliau'}
                  variant="primary"
                  onClick={goToNextStep}
                />
              </div>
            </div>

            {/* 3D Preview Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Peržiūra</h3>
                <p className="text-gray-600">3D vizualizacija</p>
              </div>

              {/* Simple 3D Frame */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg relative overflow-hidden">
                  <Tank3DPreview formData={formValues} />
                  
                  {/* Simple loading state */}
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">3D peržiūra</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-lg font-semibold text-gray-900">{formValues.volume || 0}L</div>
                  <div className="text-xs text-gray-500">Tūris</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-lg font-semibold text-gray-900">{formValues.material || '304'}</div>
                  <div className="text-xs text-gray-500">Medžiaga</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
            
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Main Form Card */}
              <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl shadow-gray-900/5 rounded-3xl overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm px-8 py-6 border-b border-white/20">
                  <div className="flex items-center">
                    <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                    <div>
                      <h2 className="text-2xl font-light text-gray-900">{steps[currentStep].label}</h2>
                      <p className="text-sm text-gray-600 mt-1">Žingsnis {currentStep + 1} iš {steps.length}</p>
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="px-8 py-10">
                  {stepComponents[currentStep]}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  label="Atgal"
                  variant="secondary"
                  onClick={goToPrevStep}
                  disabled={currentStep === 0}
                />
                
                <div className="flex items-center space-x-3">
                  {/* Progress Dots */}
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50'
                            : index < currentStep
                            ? 'bg-blue-400'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <Button
                  label={currentStep === steps.length - 1 ? 'Užbaigti' : 'Toliau'}
                  variant="primary"
                  onClick={goToNextStep}
                />
              </div>
            </div>

            {/* 3D Preview Column */}
            <div className="lg:col-span-5">
              <div className="sticky top-8 space-y-6">
                {/* Preview Header */}
                <div className="text-center lg:text-left">
                  <h3 className="text-3xl font-light text-gray-900 mb-2">Jūsų talpa</h3>
                  <p className="text-gray-600">Realaus laiko 3D peržiūra</p>
                </div>

                {/* 3D Viewer - Premium Frame */}
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  
                  {/* Main Frame */}
                  <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-3 shadow-2xl">
                    {/* Inner Frame */}
                    <div className="bg-gray-950 rounded-[20px] p-6">
                      {/* 3D Viewport */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl relative overflow-hidden">
                        <Tank3DPreview formData={formValues} />
                        
                        {/* Loading State */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-lg font-medium text-gray-700">3D vizualizacija</div>
                              <div className="text-sm text-gray-500 mt-1">Automatiškai atnaujinama</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="mt-6 flex justify-center">
                        <div className="inline-flex items-center space-x-3 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-gray-300 text-xs font-medium">Sinchronizuota</span>
                          <div className="w-px h-3 bg-gray-600"></div>
                          <span className="text-gray-400 text-xs">{formValues.volume || 0}L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-light text-gray-900">{formValues.volume || 0}L</div>
                    <div className="text-xs text-gray-600 mt-1">Tūris</div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-light text-gray-900">{formValues.material || '304'}</div>
                    <div className="text-xs text-gray-600 mt-1">Medžiaga</div>
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
