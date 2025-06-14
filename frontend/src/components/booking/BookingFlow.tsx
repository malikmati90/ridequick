"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProgressSteps from "@/components/ui/progress-steps"
import { AnimatePresence, motion } from "framer-motion"
import { useBookingStore } from "@/lib/store"
import CategoryStep from "./steps/CategoryStep"
import ContactDetailsStep from "./steps/ContactDetailsStep"
import PaymentStep from "./steps/PaymentStep"
import { SessionProvider } from '@/lib/session-context';
import { Session } from "next-auth"
import { getUserMe } from "@/lib/booking/authFlow"


interface BookingFlowProps {
  session: Session | null;
}

// Steps in the booking process
const STEPS = {
  FARE: 0,
  DETAILS: 1,
  PAYMENT: 2,
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
  const { pickupLocation, setBookingDetails } = useBookingStore()

  const initialStepParam = searchParams.get("step")
  const [skipContact, setSkipContact] = useState(false) // FLAG

  const currentStep = useBookingStore((state) => state.currentStep);
  const setCurrentStep = useBookingStore((state) => state.setCurrentStep);

  // Set initial step based on URL parameter
  useEffect(() => {
    switch (initialStepParam) {
      case "contact":
        setCurrentStep(STEPS.DETAILS);
        break;
      case "payment":
        setCurrentStep(STEPS.PAYMENT);
        break;
      default:
        setCurrentStep(STEPS.FARE);
    }
  }, [initialStepParam, setCurrentStep]);

  useEffect(() => {
    const checkSessionAndFetchUser = async () => {
      if (session?.accessToken) {
        try {
          const userMe = await getUserMe(session.accessToken);
          if (userMe) {
            setBookingDetails({
              name: userMe.full_name,
              email: userMe.email,
              phone: userMe.phone_number,
            });
            setSkipContact(true);
          }
        } catch (err) {
          router.push("/")
        }
      }
    };
  
    checkSessionAndFetchUser();
  }, []);
  
  // useEffect(() => {
  //   if (session?.accessToken) {
  //     setSkipContact(true);
  //   }
  // }, [session]);

  // Check if we have the necessary data to start the booking process
  useEffect(() => {
    if (!pickupLocation) {
      // If no pickup location is set, redirect back to home page
      router.push("/")
    }
  }, [pickupLocation, router])

  // Navigate to next step
  const nextStep = () => {
    setDirection(1);

    const next = skipContact && currentStep === STEPS.FARE
      ? STEPS.PAYMENT
      : Math.min(currentStep + 1, STEPS.PAYMENT);

    setCurrentStep(next);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate to previous step
  const prevStep = () => {
    setDirection(-1);

    const prev = skipContact && currentStep === STEPS.PAYMENT
      ? STEPS.FARE
      : Math.max(currentStep - 1, STEPS.FARE);

    setCurrentStep(prev);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              steps={["Vehicle Selection", "Contact Details", "Payment"]}
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

            </AnimatePresence>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}
