'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useBookingStore } from "@/lib/store"
import { useEffect } from "react"


export default function BookingCancelPage() {
  const { isBookingComplete, resetBooking } = useBookingStore()
  const router = useRouter()

  // Prevent access unless the booking flow was started
  useEffect(() => {
    if (!isBookingComplete) {
        router.replace("/")
    }
  }, [isBookingComplete, router])

  // Clear state after short delay
  useEffect(() => { 
    const timer = setTimeout(() => resetBooking(), 5000)
    return () => clearTimeout(timer)
  }, [resetBooking])

  if (!isBookingComplete) return null

  return (
    <div className="max-w-xl mx-auto text-center py-40 px-4">
      <Image
        src="/booking-cancel-icon.png"
        alt="Booking Cancelled Icon"
        height={75}
        width={75}
        className="relative mx-auto"
      />

      <h1 className="text-3xl font-bold mt-10 text-red-600">Booking Cancelled</h1>
      <p className="text-gray-600 mt-2">
        Your booking was not completed. It looks like the payment was canceled or interrupted.
      </p>

      <p className="text-sm text-gray-500 mt-2">
        If this was a mistake, you can try again below.
      </p>

      <Button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => router.push("/")}>
        Return to Booking
      </Button>
    </div>
  )
}
