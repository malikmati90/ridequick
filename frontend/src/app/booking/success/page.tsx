'use client'

import { useBookingStore } from "@/lib/store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"


export default function BookingSuccessPage() {
  const { hasHydrated, isBookingComplete, resetBooking } = useBookingStore()
  const router = useRouter()

  useEffect(() => {
    if (hasHydrated && !isBookingComplete) {
      router.replace("/") // redirect to homepage if not completed
    }
  }, [hasHydrated, isBookingComplete, router])

  useEffect(() => {
    // Reset the store after 5 seconds
    if (!hasHydrated) return
    const timer = setTimeout(() => resetBooking(), 5000)
    return () => clearTimeout(timer)
  }, [hasHydrated, resetBooking])

  if (!hasHydrated || !isBookingComplete) {
    return null
  }

  return (
    <div className="max-w-xl mx-auto text-center py-40 px-4">
      <Image
        src="/success.png"
        alt="Confirmation"
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
