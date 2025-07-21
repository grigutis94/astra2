import type { FormStep } from '../types/tankTypes';

interface FormStepperProps {
  steps: FormStep[];
  currentStep: number;
}

const FormStepper = ({ steps, currentStep }: FormStepperProps) => {
  return (
    <div className="w-full">
      {/* Dark Themed Progress */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        
        {/* Steps Row */}
        <div className="flex items-center justify-between relative mb-6">
          {/* Background Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-slate-700 rounded-full"></div>
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {/* Step Circles */}
          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  index < currentStep
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-transparent text-white shadow-lg shadow-emerald-500/50'
                    : index === currentStep
                    ? 'bg-slate-800 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-700 border-slate-600 text-slate-400'
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              
              <div className="mt-3 text-center">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-white' : 'text-slate-400'
                }`}>
                  {step.label}
                </div>
                {index === currentStep && (
                  <div className="text-xs text-emerald-400 mt-1 font-medium">Aktyvus</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress Info */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
            <span className="text-slate-300">
              {Math.round((currentStep / (steps.length - 1)) * 100)}% baigta
            </span>
          </div>
          <span className="text-slate-400">{currentStep + 1} / {steps.length}</span>
        </div>
      </div>
    </div>
  );
};

export default FormStepper;
