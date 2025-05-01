import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: `url('/bcn_city.jpg')`, // Image path
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay */}
      <div className="relative z-10 max-w-screen-xl mx-auto py-50 px-6 text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Fast, Reliable Taxi Services in Barcelona
        </h1>
        {/* Subheading */}
        <p className="mt-8 text-lg sm:text-xl">
          Book your ride in just a few taps—whether you’re going to the airport, a meeting, or a night out.
          {/* <p>Enjoy a safe, comfortable journey to your destination.</p> */}
        </p>

        {/* Buttons */}
        <div className="mt-16 flex justify-center gap-4">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black h-12 px-6 py-3 text-lg font-semibold rounded-md">
            Book a Ride
          </Button>
          <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black h-12 px-6 py-3 text-lg font-semibold rounded-md">
            <a href="#features" className="flex items-center">
              Learn More
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </Button>

        </div>
      </div>
    </section>
  );
}
