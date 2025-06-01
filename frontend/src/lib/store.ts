import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PlaceResult } from "../../types/maps"
import { BookingEstimateResponse } from "../../types/booking"

export interface VehicleOption {
  name: string
  capacity: number
  features: string[]
  image: string
}

export interface BookingState {
  // Initial booking
  pickupLocation?: PlaceResult
  destination?: PlaceResult
  date?: Date
  time?: Date
  passengers: number
  vehicleType: string

  // Fare estimation
  estimatedDistance: number
  estimatedDuration: number
  selectedVehicle: string
  selectedFare: number
  fareEstimates: BookingEstimateResponse[]

  // Contact details
  name: string
  phone: string
  email: string
  notes: string

  //  Payment
  paymentMethod: "card" | "paypal" | "cash"

  // Booking status
  isBookingComplete: boolean
  hasHydrated: boolean

  // Booking flow step
  currentStep: number;

  // Actions
  setBookingDetails: (details: Partial<BookingState>) => void
  setCurrentStep: (step: number) => void;
  resetBooking: () => void
  completeBooking: () => void
}

// Vehicle options data
export const vehicleOptions: Record<string, VehicleOption> = {
  economy: {
    name: "Economy",
    capacity: 4,
    features: ["Budget-friendly option", "Standard sedan"],
    image: "/sedan.png",
  },
  standard: {
    name: "Standard",
    capacity: 4,
    features: ["Comfortable ride", "Mid-size vehicle", "Air conditioning"],
    image: "/van.png",
  },
  premium: {
    name: "Premium",
    capacity: 4,
    features: [
      "Luxury experience",
      "High-end vehicle",
      "Air conditioning",
      "Free Wi-Fi",
      "Bottled water",
    ],
    image: "/placeholder.svg?",
  },
//   van: {
//     name: "Van",
//     features: ["Spacious vehicle", "Up to 8 passengers", "Ideal for groups", "Luggage space"],
//     image: "/placeholder.svg?height=100&width=200",
//   },
}


// Create the store with persistence
export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      // Initial state
      pickupLocation: undefined,
      destination: undefined,
      date: undefined,
      time: undefined,

      passengers: 2,
      vehicleType: "standard",

      estimatedDistance: 0,
      estimatedDuration: 0,
      selectedVehicle: "",
      selectedFare: 0,
      fareEstimates:[],

      name: "",
      phone: "",
      email: "",
      notes: "",

      paymentMethod: "card",
      
      isBookingComplete: false,
      hasHydrated: false,

      currentStep: 0,

      // Actions
      setBookingDetails: (details) =>
        set((state) => ({
          ...state,
          ...details,
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      resetBooking: () =>
        set((state) => ({
          ...state,
          pickupLocation: undefined,
          destination: undefined,
          date: undefined,
          time: undefined,
          passengers: 2,
          vehicleType: "standard",
          estimatedDistance: 0,
          estimatedDuration: 0,
          selectedVehicle: "",
          selectedFare: 0,
          fareEstimates: [],
          name: "",
          phone: "",
          email: "",
          notes: "",
          paymentMethod: "card",
          isBookingComplete: false,
          hasHydrated: false,
          currentStep: 0,
        })),

      completeBooking: () =>
        set((state) => ({
          ...state,
          isBookingComplete: true,
        })),
    }),
    {
      name: "taxi-booking-storage",
      onRehydrateStorage: () => (state) => {
        state?.setBookingDetails?.({ hasHydrated: true })
      },
    },
  ),
)
