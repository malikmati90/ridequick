import { Button } from "@/components/ui/button";
import { Car, Star, Plane, Clock, Check } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: <Car className="h-12 w-12 text-yellow-500" />,
      title: "Standard Taxi",
      description: "Affordable, reliable, and quick taxi services for your everyday needs.",
      features: ["24/7 availability", "Multiple vehicle options", "Fixed pricing"],
    },
    {
      icon: <Plane className="h-12 w-12 text-yellow-500" />,
      title: "Airport Transfers",
      description: "Fast and convenient airport pickups and drop-offs, available 24/7.",
      features: ["Flight tracking", "Meet & greet service", "Luggage assistance"],
    },
    {
      icon: <Clock className="h-12 w-12 text-yellow-500" />,
      title: "Hourly/Charter Service",
      description: "Rent a car with a driver for a few hours or an entire day.",
      features: ["Flexible booking", "Customizable hours", "Reliable service"],
    },
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        {/* Title and Introduction */}
        <h2 className="text-3xl font-extrabold text-gray-900">Our Services</h2>
        <p className="mt-4 text-lg text-gray-600">Explore the different transportation options we provide, designed to fit your needs.</p>
        
        {/* Service Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center hover:scale-105 transform transition-transform duration-200 ease-in-out"
            >
              <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{service.title}</h3>
              <p className="mt-2 text-gray-600">{service.description}</p>

              {/* Features List */}
              <ul className="text-left w-full space-y-2 mt-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Call to Action Button */}
              <Button className="mt-12 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 text-lg font-semibold rounded-md">
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
