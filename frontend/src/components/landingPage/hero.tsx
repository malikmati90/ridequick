import BookingFormWrapper from "../booking/booking-form-wrapper"

export default function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: `url('/bcn_city.jpg')`, // Image path
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* LEFT: Heading & Subtitle */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Fast, Reliable Taxi Services in Barcelona
            </h1>
            <p className="mt-8 text-lg sm:text-xl">
              Book your ride in just a few taps—whether you’re going to the airport, a meeting, or a night out.
            </p>
          </div>

          {/* RIGHT: Booking Form */}
          <div className="flex justify-end">
            <div className="max-w-md w-full">
              <BookingFormWrapper />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
