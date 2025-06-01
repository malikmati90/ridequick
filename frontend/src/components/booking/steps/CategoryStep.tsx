"use client"

import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBookingStore, vehicleOptions } from "@/lib/store"
import Image from "next/image"

interface CategoryStepProps {
  onBack: () => void
  onComplete: () => void
}

export default function CategoryStep({ onBack, onComplete }: CategoryStepProps) {
  // Get state and actions from our store
  const { selectedVehicle, selectedFare, fareEstimates, setBookingDetails } = useBookingStore()

  // Set the initial selected vehicle based on the booking form
  const handleSelectVehicle = (type: string, fare: number) => {
    // const fare = fareEstimates.find(f => f.category === selectedVehicle)
    setBookingDetails({
      selectedVehicle: type,
      selectedFare: fare
    })
  }

  const handleContinue = () => {
    if (!selectedVehicle) return
    onComplete()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Select Your Ride</h2>
        <p className="text-sm text-gray-500">Choose a category that fits your needs</p>
      </div>

      <div className="space-y-4">
        {[...fareEstimates]
        .sort((a, b) => a.estimated_fare - b.estimated_fare)
        .map((estimate) => {
          const type = estimate.category
          const fare = estimate.estimated_fare
          const vehicle = vehicleOptions[type]

          return (
          <Card
            key={type}
            className={`cursor-pointer transition-all ${
              selectedVehicle === type ? "border-yellow-500 ring-2 ring-yellow-200" : "hover:border-gray-300"
            }`}
            onClick={() => handleSelectVehicle(type, fare)}
          >
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div>
              <CardTitle className="capitalize">{vehicle?.name ?? type}</CardTitle>
              <CardDescription>{estimate.estimated_fare.toFixed(2)}€ estimated fare</CardDescription>
              </div>
              {selectedVehicle === type && (
                <div className="h-6 w-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Image
                    src={vehicle?.image ?? "/placeholder.svg"}
                    alt={vehicle?.name ?? type}
                    height={100}
                    width={200}
                    className="rounded-md w-full h-auto"
                  />
                </div>
                <div className="col-span-2">
                  <ul className="space-y-1">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center text-gray-600">
                        <span className="h-1.5 w-1.5 bg-yellow-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )})}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedVehicle}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-8"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
