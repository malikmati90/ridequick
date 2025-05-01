import { Header } from "@/components/ui/header"
import HeroSection from "@/components/ui/landingPage/hero"
import FeaturesSection from "@/components/ui/landingPage/features-section"
import HowItWorksSection from "@/components/ui/landingPage/how-it-works-section"
import ServicesSection from "@/components/ui/landingPage/services-section"
import TestimonialsSection from "@/components/ui/landingPage/testimonials-section"
import CTASection from "@/components/ui/landingPage/cta-section"
import FAQSection from "@/components/ui/landingPage/faq-section"
import Footer from "@/components/ui/footer"

export default function LandingPage() {
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
