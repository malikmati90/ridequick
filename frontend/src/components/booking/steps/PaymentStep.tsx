'use client'

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useBookingStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { createStripeCheckoutSession } from "@/lib/booking/checkout"
import { CreateSessionParams } from "../../../../types/booking"
import { useSessionContext } from "@/lib/session-context"

interface PaymentStepProps {
  onBack: () => void
  onComplete: () => void
}

export default function PaymentStep({ onBack, onComplete }: PaymentStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    pickupLocation,
    destination,
    date,
    time,
    passengers,
    name,
    email,
    phone,
    estimatedDistance,
    estimatedDuration,
    selectedVehicle,
    selectedFare,
  } = useBookingStore()

  const session = useSessionContext();
  const [redirectError, setRedirectError] = useState<string | null>(null)

  const handleContinue = async () => {
    if (!selectedVehicle) return toast.error("Please select a vehicle")
    if (!selectedFare) return toast.error("Vehicle pricing not found")

    // Check if user is authenticated
    if (!session?.accessToken) {
      toast.error("Please log in to continue with payment");
      return;
    }
    try {
      setIsLoading(true)
      setRedirectError(null)

      // Build scheduled datetime
      const d = date instanceof Date ? date : new Date(date!)
      const t = time instanceof Date ? time : new Date(time!)
      const scheduled = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        t.getHours(),
        t.getMinutes(),
        t.getSeconds(),
      )

      const requestBody: CreateSessionParams = {
        name,
        email,
        phone,
        price: selectedFare,
        selected_vehicle: selectedVehicle,
        passengers,
        pickup_location: `${pickupLocation?.name} - ${pickupLocation?.formattedAddress}`,
        destination: `${destination?.name} - ${destination?.formattedAddress}`,
        scheduled_time: scheduled.toISOString(),
        estimatedDistance,
        estimatedDuration,
      };
      
      const result = await createStripeCheckoutSession(requestBody, session!.accessToken)

      if (result.error) {
        // Handle error case
        setRedirectError(result.error);
        toast.error(result.error);
      } else if (result.sessionUrl) {
        // Success case - redirect to Stripe
        window.location.href = result.sessionUrl;
      } else {
        // Unexpected case
        toast.error("Unexpected response from payment service");
      }   

    } catch (error: unknown) {
      setRedirectError("We were unable to redirect you to Stripe. Please try again shortly.")
      toast.error("Payment redirect failed.")
    
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Secure Payment</h2>
      <p className="text-gray-600">You&apos;ll be redirected to Stripe to complete your booking.</p>

      {redirectError && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-md mb-4">
          {redirectError}
        </div>
      )}

      <div className="flex justify-between pt-6" aria-busy={isLoading}>
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleContinue}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 100 20v-4l-5 5 5 5v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              Redirecting...
            </span>
          ) : (
            <>
              Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

    </div>
  )
}
