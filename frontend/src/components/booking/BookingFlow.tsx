"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProgressSteps from "@/components/ui/progress-steps"
import { AnimatePresence, motion } from "framer-motion"
import { useBookingStore } from "@/lib/store"
import CategoryStep from "./steps/CategoryStep"
import ContactDetailsStep from "./steps/ContactDetailsStep"
import PaymentStep from "./steps/PaymentStep"
import SuccessStep from "./steps/SuccessStep"
import { SessionProvider } from '@/lib/session-context';
import { Session } from "next-auth"


interface BookingFlowProps {
  session: Session | null;
}

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

export default function BookingFlow({ session }: BookingFlowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // const [currentStep, setCurrentStep] = useState(STEPS.FARE)
  const [direction, setDirection] = useState(0)
  const { pickupLocation } = useBookingStore()

  const initialStepParam = searchParams.get("step")
  const [skipContact, setSkipContact] = useState(false) // FLAG

  const [currentStep, setCurrentStep] = useState(() => {
    switch (initialStepParam) {
      case "contact":
        return STEPS.DETAILS
      case "payment":
        return STEPS.PAYMENT
      case "confirmation":
        return STEPS.SUCCESS
      default:
        return STEPS.FARE
    }
  })

  // const { data: session, status } = useSession();

  // console.log("Session status:", status);
  // console.log("Session data:", session);
  
  // Check if user is logged in and update state
  // useEffect(() => {
  //   const email = session?.user?.email;
  //   if (status === "authenticated" || email) {
  //     setSkipContact(true);
  //   }
    
  // }, [status]);

  useEffect(() => {
    if (session?.accessToken) {
      setSkipContact(true);
    }
  }, [session]);

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

    setCurrentStep(prev => {
      // Skip DETAILS (Contact Form) if user is logged in
      if (skipContact && prev === STEPS.FARE) return STEPS.PAYMENT
      return Math.min(prev + 1, STEPS.SUCCESS)
    })

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Navigate to previous step
  const prevStep = () => {
    setDirection(-1)

    setCurrentStep(prev => {
      // If contact is skipped and we're at PAYMENT, go back to FARE
      if (skipContact && prev === STEPS.PAYMENT) return STEPS.FARE
      return Math.max(prev - 1, STEPS.FARE)
    })
    
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
    <SessionProvider session={session}>
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

              {currentStep === STEPS.DETAILS && !skipContact && (
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
    </SessionProvider>
  )
}
