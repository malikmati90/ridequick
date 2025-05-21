import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-yellow-500 text-black">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        {/* Title and Introduction */}
        <h2 className="text-3xl font-extrabold">Ready to Book Your Ride?</h2>
        <p className="mt-4 text-lg">Quick, affordable, and reliable transportation at your fingertips.</p>
        
        {/* CTA Buttons */}
        <div className="mt-8 space-x-4">
          <Button className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-lg font-semibold rounded-md">
            Book Now
          </Button>
          <Button className="bg-white hover:bg-gray-100 text-yellow-500 px-10 py-4 text-lg font-semibold rounded-md border border-yellow-500">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
