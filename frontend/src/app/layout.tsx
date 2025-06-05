import "./globals.css";
import type { Metadata } from "next";
import { geistMono, geistSans } from "@/components/ui/fonts";



export const metadata: Metadata = {
  title: "Barcelona Taxi Service",
  description: "Book a taxi quickly and easily in Barcelona.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
