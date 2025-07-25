import type { FormStep } from '../types/tankTypes';
import { useTranslation } from '../contexts/LanguageContext';

interface FormStepperProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const FormStepper = ({ steps, currentStep, onStepClick }: FormStepperProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="w-full">
      {/* Dark Themed Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-lg">
        
        {/* Steps Row */}
        <div className="flex items-center justify-between relative mb-6">
          {/* Background Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-5 left-0 h-1 bg-astra-soft rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Step Circles */}
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => onStepClick?.(index)}
                disabled={!onStepClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  index < currentStep
                    ? 'bg-astra-soft border-astra-soft text-white shadow-md'
                    : index === currentStep
                    ? 'bg-white dark:bg-gray-800 border-astra-soft text-astra-soft shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                } ${onStepClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95' : 'cursor-default'} disabled:cursor-default`}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </button>
              
              <div className="mt-3 text-center">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.label}
                </div>
                {index === currentStep && (
                  <div className="text-xs text-astra-soft mt-1 font-medium">{t('common.current')}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress Info */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-astra-soft rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              {Math.round((currentStep / (steps.length - 1)) * 100)}% {t('common.completed')}
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">{currentStep + 1} / {steps.length}</span>
        </div>
      </div>
    </div>
  );
};

export default FormStepper;
