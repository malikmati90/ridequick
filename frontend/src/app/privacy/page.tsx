import Footer from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Header />
      <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <CheckCircle className="mx-auto h-12 w-12 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-500">
              Last updated: <time dateTime="2025-06-01">June 1, 2025</time>
            </p>
          </div>

          <div className="space-y-10 text-gray-700 text-sm">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">1. Introduction</h2>
              <p className="mt-2">
                Welcome to <strong>RideQuick</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, and safeguard your personal information. By using our website or services, you consent to this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">2. Information We Collect</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Contact Information:</strong> Name, phone number, email address, etc.</li>
                <li><strong>Booking Information:</strong> Pickup/drop-off locations, date, time, number of passengers, payment details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Providing Services:</strong> To process and fulfill ride bookings.</li>
                <li><strong>Communication:</strong> Updates, notifications, and offers (with consent).</li>
                <li><strong>Improvement:</strong> To enhance our services and platform.</li>
                <li><strong>Compliance:</strong> To comply with legal requirements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">4. Sharing Your Information</h2>
              <p className="mt-2">We do not sell or rent your data. We may share it with:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Service Providers:</strong> Payment processors, infrastructure tools, etc.</li>
                <li><strong>Legal Authorities:</strong> When legally required to do so.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">5. Data Retention</h2>
              <p className="mt-2">
                We retain your personal data only as long as needed for the purposes described or until you request deletion.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">6. Your Rights</h2>
              <p className="mt-2">You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Access and correct your information</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing</li>
                <li>Request data portability</li>
                <li>Withdraw marketing consent</li>
              </ul>
              <p className="mt-2">Contact us at <Link href="mailto:info@ridequick.com" className="text-yellow-600 underline">info@ridequick.com</Link> to exercise your rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">7. Security</h2>
              <p className="mt-2">We implement reasonable safeguards such as SSL encryption to protect your data during transmission and storage.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">8. Third-Party Links</h2>
              <p className="mt-2">Our site may contain links to third-party websites. We are not responsible for their privacy practices.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">9. Changes to This Policy</h2>
              <p className="mt-2">We may update this Privacy Policy periodically. Please review this page for any updates.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
              <p className="mt-2">
                For questions or concerns, please contact:
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
