import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function Header2() {
  return (
    <header className="relative w-full flex flex-col items-center justify-center text-center px-6 py-4">
      <div className="container flex items-center justify-between w-full max-w-7xl">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-yellow-500" />
          <span className="text-xl font-bold">RideQuick</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
            Testimonials
          </Link>
          <Link href="#services" className="text-sm font-medium hover:text-primary">
            Services
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">
            Login
          </Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Book Now</Button>
        </div>
      </div>
    </header>
  )
}
