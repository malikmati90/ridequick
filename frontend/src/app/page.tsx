"use client"

import { Header } from "@/components/ui/header"
import HeroSection from "@/components/landingPage/hero"
import FeaturesSection from "@/components/landingPage/features-section"
import HowItWorksSection from "@/components/landingPage/how-it-works-section"
import ServicesSection from "@/components/landingPage/services-section"
import TestimonialsSection from "@/components/landingPage/testimonials-section"
import CTASection from "@/components/landingPage/cta-section"
import FAQSection from "@/components/landingPage/faq-section"
import Footer from "@/components/ui/footer"
import { useBookingStore } from "@/lib/store"
import { useEffect } from "react"

export default function LandingPage() {
  const { resetInitialBooking } = useBookingStore()

  useEffect(() => {
    resetInitialBooking()
  }, [resetInitialBooking])

  return (
    <div>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ServicesSection />
        <TestimonialsSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
