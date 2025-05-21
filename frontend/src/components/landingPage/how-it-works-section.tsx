import { Button } from "@/components/ui/button";

export default function HowItWorksSection() {
  // Define the steps for the How It Works section
  const steps = [
    {
      number: "1",
      title: "Enter Your Pickup Location",
      description: "Simply enter your pickup point and destination address in just a few taps.",
    },
    {
      number: "2",
      title: "Choose Your Ride",
      description: "Select the type of vehicle that suits your needs—whether it's a standard taxi or VIP service.",
    },
    {
      number: "3",
      title: "Confirm Your Ride",
      description: "Review the trip details and confirm your booking with a tap.",
    },
    {
      number: "4",
      title: "Enjoy Your Ride",
      description: "Your driver will arrive promptly at your pickup location. Sit back and enjoy the ride!",
    },
];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        {/* Title and Introduction */}
        <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
        <p className="mt-4 text-lg text-gray-600">Booking your ride is quick and easy. Just follow these simple steps:</p>
        
        {/* Steps */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center transform transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-lg">

              <div className={`flex justify-center items-center w-16 h-16 rounded-full bg-yellow-500 text-white text-xl font-semibold`}>
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className="mt-12">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 text-lg font-semibold rounded-md">
            Book Your Ride Now
          </Button>
        </div> */}
      </div>
    </section>
  );
}
