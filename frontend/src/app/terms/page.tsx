import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Footer from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

export default function TermsOfServicePage() {
  return (
    <main>
      <Header />
      <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <ShieldCheck className="mx-auto h-12 w-12 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Terms and Conditions</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: <time dateTime="2025-06-01">June 1, 2025</time>
            </p>
          </div>

          <div className="space-y-10 text-gray-700 text-sm">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">1. Introduction</h2>
              <p className="mt-2">
                Welcome to <strong>RideQuick</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website and services, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">2. Booking and Payment</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>You must be at least 18 years old to book a ride.</li>
                <li>Provide accurate contact and booking details. Incorrect information may lead to booking failure or cancellation.</li>
                <li>Booking becomes valid only after full payment and confirmation via email.</li>
                <li>We offer various payment methods including card and Stripe integration. Additional fees may apply.</li>
                <li>Changes to bookings must be requested at least 24 hours in advance. Last-minute changes are subject to driver approval.</li>
                <li>Refunds are not guaranteed if cancellation is requested within 24 hours of the scheduled ride.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">3. Responsibilities and Conduct</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>You are responsible for ensuring necessary documents for international travel (if applicable).</li>
                <li>Drivers may refuse service to individuals under the influence or engaging in unsafe behavior.</li>
                <li>Smoking, alcohol, and food consumption are not permitted inside the vehicles.</li>
                <li>We reserve the right to charge for damages, lost items, or extraordinary cleaning needs.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">4. Vehicle and Service Details</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Rides are booked by category (Economy, Standard, First Class), not by specific vehicle model.</li>
                <li>We strive to match your preferences but do not guarantee exact vehicle availability.</li>
                <li>Child seats and folding wheelchair accommodation can be requested during booking.</li>
                <li>Declared luggage must be accurate. We are not responsible for loss or damage of undeclared or inappropriate items.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">5. User Responsibilities</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>You agree to use our website and services in accordance with applicable laws.</li>
                <li>You must not use our platform for fraudulent or unlawful purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">6. Limitation of Liability</h2>
              <p className="mt-2">We are not liable for service interruptions or events beyond our control (force majeure). Our liability is limited to the amount paid by the customer for the affected service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">7. Intellectual Property</h2>
              <p className="mt-2">All website content including text, graphics, logos, and code is owned or licensed by RideQuick. You may not reuse or reproduce without permission.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">8. Governing Law</h2>
              <p className="mt-2">These terms are governed by the laws of Spain. Any disputes shall be resolved in the courts of Barcelona.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">9. Updates to These Terms</h2>
              <p className="mt-2">We may revise these terms periodically. Continued use of the website after updates constitutes acceptance of the revised terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">10. Contact Us</h2>
              <p className="mt-2">
                For any questions regarding these terms, please contact:
                <br />
                <strong>RideQuick</strong><br />
                Email: <Link href="mailto:info@ridequick.com" className="text-yellow-600 underline">info@ridequick.com</Link>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
