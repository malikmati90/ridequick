import { auth } from "@/auth";
import BookingFlow from "@/components/booking/BookingFlow"
import BookingSummary from "@/components/booking/BookingSummary"
import MobileBookingSummary from "@/components/booking/MobileBookingSummary";
import { MinimalHeader } from "@/components/ui/MinimalHeader";
import { Suspense } from "react"

export default async function BookingPage() {
  const session = await auth();
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <MinimalHeader />      
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mobile Summary on Top */}
        <div className="block lg:hidden">
          <MobileBookingSummary />
        </div>
        
        {/* Left: Booking Flow */}
        <div className="lg:col-span-2">
          <Suspense>
            <BookingFlow session={session} />
          </Suspense>
        </div>

        {/* Right: Booking Summary */}
        <div className="hidden lg:block">
          <BookingSummary />
        </div>

      </div>
    </main>
  )
}
