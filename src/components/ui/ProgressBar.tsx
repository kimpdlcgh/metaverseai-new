import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium
                ${index + 1 <= currentStep
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
                }
                ${index + 1 === currentStep ? 'ring-4 ring-emerald-100' : ''}
                min-h-[44px] min-w-[44px]
              `}
              role="button"
              tabIndex={0}
              aria-label={`Step ${index + 1}: ${step} ${index + 1 === currentStep ? '(current step)' : index + 1 < currentStep ? '(completed)' : ''}`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-2 text-slate-600 text-center max-w-[80px]">
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          role="progressbar"
          aria-valuenow={(currentStep / totalSteps) * 100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${currentStep} of ${totalSteps}: ${steps[currentStep-1]}`}
        ></div>
      </div>
    </div>
  );
};