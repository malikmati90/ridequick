'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ServiceUnavailablePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">
          Service Unavailable
        </h1>
        <p className="text-gray-600 text-base mb-6">
          We&apos;re currently experiencing technical issues. Our booking system is temporarily unavailable.
          <br />
          Please try again in a few minutes.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Retry
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
