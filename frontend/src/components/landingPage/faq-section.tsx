import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer a wide range of services including standard taxis, VTC services, airport transfers, cruise transfers, hourly charter services, etc.",
    },
    {
      question: "How can I book a ride?",
      answer: "You can book a ride through our website. Simply enter your pickup location and destination, choose your vehicle, and confirm your booking.",
    },
    {
      question: "Are your prices fixed?",
      answer: "Yes, our prices are fixed. You will see the price estimate before confirming your booking, so you know exactly what you'll pay.",
    },
    {
      question: "Can I change my booking after it's confirmed?",
      answer: "Yes, you can modify your booking up to 2 hours before the scheduled pickup.",
    },
    {
      question: "What if I need to cancel my booking?",
      answer: "You can cancel your booking free of charge up to 24 hours before your scheduled pickup time. Cancellations made less than 24 hours before may incur a small fee.",
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-xl mx-auto px-6 text-center">
        {/* Title and Introduction */}
        <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
        <p className="mt-4 text-lg text-gray-600">Find answers to the most common questions about our services.</p>

        {/* Accordion for FAQ */}
        <div className="mt-12 w-full max-w-xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold text-left py-4 px-6 w-full border-b-2 border-gray-200 hover:bg-gray-100">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="py-2 px-6 text-gray-600 text-left">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
