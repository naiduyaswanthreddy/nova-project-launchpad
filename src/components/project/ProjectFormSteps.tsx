
import { Check } from "lucide-react";

interface ProjectFormStepsProps {
  steps: Array<{ title: string; description: string }>;
  currentStep: number;
}

export function ProjectFormSteps({ steps, currentStep }: ProjectFormStepsProps) {
  return (
    <div className="grid grid-cols-6 gap-2 mb-6">
      {steps.map((step, index) => (
        <div key={index} className="text-center">
          <div 
            className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1 transition-colors
              ${index < currentStep ? 'bg-green-500/20 text-green-400 border border-green-500' :
                index === currentStep ? 'bg-purple-500/30 text-white border border-purple-500' :
                'bg-gray-800/50 text-gray-400 border border-gray-700'}`}
          >
            {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
          </div>
          <p className={`text-xs truncate ${index === currentStep ? 'text-purple-400 font-medium' : 'text-gray-400'}`}>
            {step.title}
          </p>
        </div>
      ))}
    </div>
  );
}
