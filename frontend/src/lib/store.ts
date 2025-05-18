// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// export interface VehicleOption {
//   name: string
//   basePrice: number
//   pricePerKm: number
//   features: string[]
//   image: string
// }

// export interface BookingState {
//   // Step 1: Initial booking
//   pickupLocation: string
//   destination: string
//   date: Date | null
//   time: string
//   passengers: string
//   vehicleType: string

//   // Step 2: Fare estimation
//   estimatedDistance: number
//   selectedVehicle: string
//   fare: string

//   // Step 3: Contact details
//   name: string
//   phone: string
//   email: string
//   notes: string

//   // Step 4: Payment
//   paymentMethod: "card" | "paypal" | "cash"
//   cardDetails: {
//     cardNumber: string
//     cardName: string
//     expiryDate: string
//     cvv: string
//   }

//   // Booking status
//   bookingId: string
//   isBookingComplete: boolean

//   // Actions
//   setBookingDetails: (details: Partial<BookingState>) => void
//   resetBooking: () => void
//   completeBooking: () => void
// }

// // Vehicle options data
// export const vehicleOptions: Record<string, VehicleOption> = {
//   economy: {
//     name: "Economy",
//     basePrice: 10,
//     pricePerKm: 1.2,
//     features: ["Budget-friendly option", "Standard sedan", "Up to 4 passengers"],
//     image: "/placeholder.svg?height=100&width=200",
//   },
//   standard: {
//     name: "Standard",
//     basePrice: 15,
//     pricePerKm: 1.5,
//     features: ["Comfortable ride", "Mid-size vehicle", "Up to 4 passengers", "Air conditioning"],
//     image: "/placeholder.svg?height=100&width=200",
//   },
//   premium: {
//     name: "Premium",
//     basePrice: 25,
//     pricePerKm: 2.0,
//     features: [
//       "Luxury experience",
//       "High-end vehicle",
//       "Up to 4 passengers",
//       "Air conditioning",
//       "Free Wi-Fi",
//       "Bottled water",
//     ],
//     image: "/placeholder.svg?height=100&width=200",
//   },
//   van: {
//     name: "Van",
//     basePrice: 30,
//     pricePerKm: 2.2,
//     features: ["Spacious vehicle", "Up to 8 passengers", "Ideal for groups", "Luggage space"],
//     image: "/placeholder.svg?height=100&width=200",
//   },
// }

// // Calculate fare based on vehicle type and distance
// export const calculateFare = (vehicleType: string, distance: number): string => {
//   const vehicle = vehicleOptions[vehicleType as keyof typeof vehicleOptions]
//   return (vehicle.basePrice + vehicle.pricePerKm * distance).toFixed(2)
// }

// // Create the store with persistence
// export const useBookingStore = create<BookingState>()(
//   persist(
//     (set) => ({
//       // Initial state
//       pickupLocation: "",
//       destination: "",
//       date: null,
//       time: "",
//       passengers: "1",
//       vehicleType: "standard",

//       estimatedDistance: 0,
//       selectedVehicle: "",
//       fare: "0",

//       name: "",
//       phone: "",
//       email: "",
//       notes: "",

//       paymentMethod: "card",
//       cardDetails: {
//         cardNumber: "",
//         cardName: "",
//         expiryDate: "",
//         cvv: "",
//       },

//       bookingId: "",
//       isBookingComplete: false,

//       // Actions
//       setBookingDetails: (details) =>
//         set((state) => ({
//           ...state,
//           ...details,
//         })),

//       resetBooking: () =>
//         set((state) => ({
//           ...state,
//           pickupLocation: "",
//           destination: "",
//           date: null,
//           time: "",
//           passengers: "1",
//           vehicleType: "standard",
//           estimatedDistance: 0,
//           selectedVehicle: "",
//           fare: "0",
//           name: "",
//           phone: "",
//           email: "",
//           notes: "",
//           paymentMethod: "card",
//           cardDetails: {
//             cardNumber: "",
//             cardName: "",
//             expiryDate: "",
//             cvv: "",
//           },
//           bookingId: "",
//           isBookingComplete: false,
//         })),

//       completeBooking: () =>
//         set((state) => ({
//           ...state,
//           bookingId: Math.floor(100000 + Math.random() * 900000).toString(),
//           isBookingComplete: true,
//         })),
//     }),
//     {
//       name: "taxi-booking-storage",
//     },
//   ),
// )
