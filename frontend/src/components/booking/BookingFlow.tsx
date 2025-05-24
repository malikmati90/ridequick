"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProgressSteps from "@/components/ui/progress-steps"
import { AnimatePresence, motion } from "framer-motion"
import { CarTaxiFrontIcon as TaxiIcon } from "lucide-react"
import { useBookingStore } from "@/lib/store"
import CategoryStep from "./steps/CategoryStep"
import ContactDetailsStep from "./steps/ContactDetailsStep"

// Steps in the booking process
const STEPS = {
  FARE: 0,
  DETAILS: 1,
  PAYMENT: 2,
  SUCCESS: 3,
}

// Animation variants
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
}

export default function BookingFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(STEPS.FARE)
  const [direction, setDirection] = useState(0)

  const { pickupLocation } = useBookingStore()

  // Check if we have the necessary data to start the booking process
  useEffect(() => {
    if (!pickupLocation) {
      // If no pickup location is set, redirect back to home page
      router.push("/")
    }
  }, [pickupLocation, router])

  // Navigate to next step
  const nextStep = () => {
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.SUCCESS))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Navigate to previous step
  const prevStep = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, STEPS.FARE))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Reset and go back to home
  const goToHome = () => {
    router.push("/")
  }

  if (!pickupLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-yellow-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <ProgressSteps
            currentStep={currentStep}
            steps={["Vehicle Selection", "Contact Details", "Payment", "Confirmation"]}
          />
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden p-6 md:p-8">
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === STEPS.FARE && (
              <motion.div
                key="fare"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
              >
                <CategoryStep onBack={goToHome} onComplete={nextStep} />
              </motion.div>
            )}

            {currentStep === STEPS.DETAILS && (
              <motion.div
                key="details"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
              >
                <ContactDetailsStep onBack={prevStep} onComplete={nextStep} />
              </motion.div>
            )}

            {currentStep === STEPS.PAYMENT && (
              <motion.div
                key="payment"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
              >
                <PaymentStep onBack={prevStep} onComplete={nextStep} />
              </motion.div>
            )}

            {currentStep === STEPS.SUCCESS && (
              <motion.div
                key="success"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.3 }}
              >
                <SuccessStep onBackToHome={goToHome} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
