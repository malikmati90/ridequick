import { CheckIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full px-4 sm:px-8">
      <div className="relative flex justify-between items-center">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="relative flex-1 flex flex-col items-center">
              {/* Connector line (before) */}
              {index !== -1 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className={`absolute left-0 top-5 h-0.5 z-0 ${
                    isComplete ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300
                  ${isComplete
                    ? "border-yellow-500 bg-yellow-500 text-white"
                    : isActive
                    ? "border-yellow-500 bg-white text-yellow-500"
                    : "border-gray-300 bg-white text-gray-500"
                  }`}
              >
                {isComplete ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="mt-2 text-center text-xs font-medium text-gray-700"
              >
                {step}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
