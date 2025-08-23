'use client';

import { useFormStore } from '@/store/formStore';

const steps = ['Setup', 'Administration', 'Vesting', 'Review', 'Complete'];

export function Stepper() {
  const { step: currentStep } = useFormStore();

  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          <p className={`ml-2 ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>{step}</p>
          {index < steps.length - 1 && <div className="flex-auto border-t-2 border-gray-200 mx-4"></div>}
        </div>
      ))}
    </div>
  );
}
