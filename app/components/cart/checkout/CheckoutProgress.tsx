'use client';

interface CheckoutProgressProps {
  currentStep: number;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { number: 1, label: 'Address' },
    { number: 2, label: 'Shipping' },
    { number: 3, label: 'Payment' },
  ];

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex-1 text-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {step.number}
            </div>
            <p
              className={`text-sm font-medium ${
                currentStep >= step.number
                  ? 'text-blue-600'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
        
        {/* Connecting lines */}
        {steps.slice(0, -1).map((_, index) => (
          <div
            key={`line-${index}`}
            className={`flex-1 h-0.5 transition-colors ${
              currentStep > index + 1
                ? 'bg-blue-600'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}