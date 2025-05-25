import { create } from "zustand"
import { persist } from "zustand/middleware"
import { PlaceResult } from "../../types/maps"
import { BookingEstimateResponse } from "../../types/booking"

export interface VehicleOption {
  name: string
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

  // Step 2: Fare estimation
  estimatedDistance: number
  selectedVehicle: string
  fareEstimates: BookingEstimateResponse[]

  // Step 3: Contact details
  name: string
  phone: string
  email: string
  notes: string

  // Step 4: Payment
  paymentMethod: "card" | "paypal" | "cash"
  cardDetails: {
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
  }

  // Booking status
  bookingId: string
  isBookingComplete: boolean

  // Actions
  setBookingDetails: (details: Partial<BookingState>) => void
  resetBooking: () => void
  completeBooking: () => void
}

// Vehicle options data
export const vehicleOptions: Record<string, VehicleOption> = {
  economy: {
    name: "Economy",
    features: ["Budget-friendly option", "Standard sedan"],
    image: "/sedan.png?height=100&width=200",
  },
  standard: {
    name: "Standard",
    features: ["Comfortable ride", "Mid-size vehicle", "Air conditioning"],
    image: "/van.png?height=100&width=200",
  },
  premium: {
    name: "Premium",
    features: [
      "Luxury experience",
      "High-end vehicle",
      "Air conditioning",
      "Free Wi-Fi",
      "Bottled water",
    ],
    image: "/placeholder.svg?height=100&width=200",
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
      selectedVehicle: "",
      fareEstimates:[],

      name: "",
      phone: "",
      email: "",
      notes: "",

      paymentMethod: "card",
      cardDetails: {
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      },

      bookingId: "",
      isBookingComplete: false,

      // Actions
      setBookingDetails: (details) =>
        set((state) => ({
          ...state,
          ...details,
        })),

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
          selectedVehicle: "",
          fare: "0",
          name: "",
          phone: "",
          email: "",
          notes: "",
          paymentMethod: "card",
          cardDetails: {
            cardNumber: "",
            cardName: "",
            expiryDate: "",
            cvv: "",
          },
          bookingId: "",
          isBookingComplete: false,
        })),

      completeBooking: () =>
        set((state) => ({
          ...state,
          bookingId: Math.floor(100000 + Math.random() * 900000).toString(),
          isBookingComplete: true,
        })),
    }),
    {
      name: "taxi-booking-storage",
    },
  ),
)
