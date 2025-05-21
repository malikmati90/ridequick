import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="container px-4 md:px-6 w-full mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl mx-auto">
          <div className="flex-1 space-y-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Ride, <span className="text-yellow-500">Just a Click Away</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Book your taxi in seconds, track your driver in real-time, and enjoy a safe, comfortable journey to your
              destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black h-12 px-6">Book Your Ride</Button>
              <Button variant="outline" className="h-12 px-6">
                Learn More <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <Image
              src="/tibidabo.jpg?height=600&width=600"
              alt="Taxi service illustration"
              width={600}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

