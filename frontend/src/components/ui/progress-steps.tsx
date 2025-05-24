import { CheckIcon } from "lucide-react"

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center">
            {/* Step Circle */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                index < currentStep
                  ? "border-yellow-500 bg-yellow-500 text-white"
                  : index === currentStep
                    ? "border-yellow-500 bg-white text-yellow-500"
                    : "border-gray-300 bg-white text-gray-300"
              }`}
            >
              {index < currentStep ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <div className="mt-2 text-center">
              <span className={`text-xs font-medium ${index <= currentStep ? "text-gray-900" : "text-gray-400"}`}>
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-full h-0.5 ${
                  index < currentStep ? "bg-yellow-500" : "bg-gray-300"
                }`}
                style={{ right: "-50%", width: "100%" }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
