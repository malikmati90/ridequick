import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Michael Chen",
      title: "Business Traveler",
      text: "Great service! The booking was quick, and the driver arrived on time. The ride was smooth, and I got to my meeting without any issues.",
      rating: 5,
    },
    {
      name: "Sarah Lee",
      title: "Tourist",
      text: "I used their airport transfer service, and I couldn’t be happier. The driver was professional, and the car was comfortable. Highly recommend!",
      rating: 5,
    },
    {
      name: "Mark Smith",
      title: "Local Resident",
      text: "I rely on this service for daily commuting. Always reliable, and the drivers are friendly. The best taxi service in the city!",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        {/* Title and Introduction */}
        <h2 className="text-3xl font-extrabold text-gray-900">What Our Customers Say</h2>
        <p className="mt-4 text-lg text-gray-600">Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about their experiences with us.</p>
        
        {/* Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-left text-left"
            >
              {/* Customer Rating */}
              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              {/* Testimonial Text */}
              <p className="text-gray-600 mb-4 italic">{testimonial.text}</p>
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.title}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className="mt-12">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold rounded-md">
            See More Reviews
          </Button>
        </div> */}
      </div>
    </section>
  );
}
