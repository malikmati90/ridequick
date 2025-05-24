import BookingFlow from "@/components/booking/BookingFlow"
import BookingSummary from "@/components/booking/BookingSummary"
import { Header } from "@/components/ui/header"

export default function BookingPage() {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Booking Flow */}
        <div className="lg:col-span-2">
          <BookingFlow />
        </div>

        {/* Right: Booking Summary */}
        <div className="hidden lg:block">
          <BookingSummary />
        </div>
      </div>
    </>
  )
}
