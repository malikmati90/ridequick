import { FastForward, Clock, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturesSection() {
  // Define the features data
  const features = [
    {
      icon: <FastForward className="h-12 w-12 text-yellow-500" />,
      title: "Fast & Reliable",
      description: "Always on time, every time. Your ride is just a tap away.",
    },
    {
      icon: <Clock className="h-12 w-12 text-yellow-500" />,
      title: "24/7 Availability",
      description: "We’re available around the clock, any day, any time.",
    },
    {
      icon: <Users className="h-12 w-12 text-yellow-500" />,
      title: "Professional Drivers",
      description: "Our drivers are trained, friendly, and professional.",
    },
    {
      icon: <DollarSign className="h-12 w-12 text-yellow-500" />,
      title: "Affordable Pricing",
      description: "Enjoy competitive rates with no hidden fees.",
    },
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us?</h2>
        <p className="mt-4 text-lg text-gray-600">Experience the best taxi and VTC services in Barcelona.</p>
        
        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg">
                {feature.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>

          ))}
        </div>
        
        {/* Call-to-Action */}
        {/* <div className="mt-12">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black h-12 px-8 py-4 text-lg font-semibold rounded-md">
            Book Your Ride Now
          </Button>
        </div> */}
      </div>
    </section>
  );
}
