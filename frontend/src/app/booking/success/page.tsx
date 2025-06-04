'use client'

import { useBookingStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { verifyPaymentIntent } from "@/lib/booking/checkout"


export default function BookingSuccessPage() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter()
  const { isBookingComplete, completeBooking, resetBooking } = useBookingStore()


  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError(true);
      setLoading(false);
      return
    }
  
    const verify = async () => {
      try {
        const res = await verifyPaymentIntent(sessionId);
        if (res?.valid) completeBooking();
        else setError(true); // invalid or unpaid booking
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);
  

  useEffect(() => {
    if (!isBookingComplete) return
    const timer = setTimeout(() => resetBooking(), 5000)
    return () => clearTimeout(timer)
  }, [resetBooking])

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 font-semibold">Unable to verify your booking</p>
          <p className="text-sm text-gray-500 mt-1">
            Please contact support or try again later.
          </p>
          <Button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  

  if (loading || !isBookingComplete) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-6 w-6 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-500">Verifying your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto text-center py-40 px-4">
      <Image
        src="/booking-confirmed-icon.png"
        alt="Booking Confirmed Icon"
        height={75}
        width={75}
        className="relative mx-auto"

      />
  
      <h1 className="text-3xl font-bold mt-10">Booking Confirmed!</h1>
      <p className="text-gray-600 mt-2">
        Thank you! Your ride has been successfully scheduled.
      </p>
  
      <p className="mt-4 text-base text-gray-500">
        We&apos;ve sent your booking details to your email. Please check your inbox for confirmation.
      </p>
  
      <Button className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => router.push("/")}>
        Book Another Ride
      </Button>
    </div>
  )
  
}
