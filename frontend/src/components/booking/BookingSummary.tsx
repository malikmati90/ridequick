"use client"

import { format } from "date-fns"
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  CreditCard,
  User,
  Phone,
  Mail,
  CheckCircle,
  DollarSign,
  Shield,
} from "lucide-react"
import { useBookingStore, vehicleOptions } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"


export default function BookingSummary() {
  const currentStep = useBookingStore((state) => state.currentStep);
  const bookingData = useBookingStore()

  const {
    pickupLocation,
    destination,
    date,
    time,
    passengers,
    selectedVehicle,
    selectedFare,
    name,
    phone,
    email,
    paymentMethod,
    estimatedDistance,
    estimatedDuration,
    isBookingComplete,
  } = bookingData

  // Get vehicle details
  const vehicleDetails = selectedVehicle ? vehicleOptions[selectedVehicle] : null

  // Format date and time
  const formattedDate = date ? format(date, "dd MMM yyyy") : ""
  const formattedTime = time ? format(time, "hh:mm a") : ""

  // Calculate estimated arrival time (simple calculation for demo)
  const calculateArrival = () => {
    if (!time || !estimatedDuration) return null;
  
    const departureTime = time instanceof Date ? time : new Date(time!);
    const arrivalTime = new Date(departureTime.getTime() + estimatedDuration * 60000);
  
    const hours = Math.floor(estimatedDuration / 60);
    const minutes = estimatedDuration % 60;
  
    let durationStr = '';
    if (hours > 0) durationStr += `${hours}h`;
    if (minutes > 0) durationStr += ` ${minutes}m`;
    durationStr = durationStr.trim();
  
    return {
      time: format(arrivalTime, "hh:mm a"),
      duration: durationStr,
    };
  };
  

  const arrivalInfo = calculateArrival()

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
        <p className="text-yellow-100 text-sm">{isBookingComplete ? "Booking Confirmed" : "Review your details"}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Trip Details - Always visible */}
        <AnimatePresence mode="wait">
          <motion.div
            key="trip-details"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h4 className="font-medium text-gray-900 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-yellow-500" />
              Trip Route
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-500">Pickup</p>
                  <p className="font-medium text-gray-900">{pickupLocation?.name || "Not selected"}</p>
                </div>
              </div>

              {/* <div className="flex items-center space-x-3 pl-1">
                <div className="w-0.5 h-6 bg-gray-300"></div>
              </div> */}

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-500">Destination</p>
                  <p className="font-medium text-gray-900">{destination?.name || "Not selected"}</p>
                </div>
              </div>
            </div>

            {/* Compact Trip Info Box */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {/* Date & Time */}
              {date && time && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-900">
                    {formattedDate} {formattedTime}
                  </span>
                </div>
              )}

              {/* Estimated Arrival */}
              {arrivalInfo && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-900">
                    Estimated arrival {arrivalInfo.time} ({arrivalInfo.duration})
                  </span>
                </div>
              )}

              {/* Distance */}
              {estimatedDistance > 0 && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-900">
                    Distance {estimatedDistance} km / {Math.round(estimatedDistance * 0.621371)} miles
                  </span>
                </div>
              )}

              {/* Passengers */}
              {passengers && (
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-900">
                    {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Vehicle Selection - Visible from step 1 */}
                {/* Vehicle Selection - Visible from step 1 */}
        <AnimatePresence>
          {currentStep >= 0 && selectedVehicle && vehicleDetails && (
            <motion.div
              key="vehicle"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <h4 className="font-medium text-gray-900 flex items-center">
                <Car className="h-4 w-4 mr-2 text-yellow-500" />
                Vehicle
              </h4>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start space-x-4">
                  {/* Vehicle Image */}
                    <Image
                      src={vehicleDetails.image}
                      alt={vehicleDetails.name}
                      width={100}
                      height={50}
                      className="w-20 h-auto object-contain rounded-md"
                    />
                  
                  {/* Vehicle Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 text-lg leading-tight">{vehicleDetails.name}</h5>
                      </div>
                      
                      {/* Price Section */}
                      {currentStep >= 0 && selectedFare && (
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-2 rounded-lg">
                            <p className="text-xl font-bold">{selectedFare} €</p>
                            <p className="text-xs text-yellow-100">Estimated fare</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Additional Info */}
                    {/* <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Up to {vehicleDetails.capacity || passengers} passengers</span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* <AnimatePresence>
          {currentStep >= 0 && selectedVehicle && vehicleDetails && (
            <motion.div
              key="vehicle"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <h4 className="font-medium text-gray-900 flex items-center">
                <Car className="h-4 w-4 mr-2 text-yellow-500" />
                Vehicle
              </h4>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Image
                    src={vehicleDetails.image}
                    alt={vehicleDetails.name}
                    width={100}
                    height={60}
                    className="w-16 h-10 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{vehicleDetails.name}</p>
                    {currentStep >= 0 && selectedFare && (
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-600">{selectedFare} €</p>
                        <p className="text-xs text-gray-500">Estimated fare</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Contact Details - Visible from step 2 */}
        <AnimatePresence>
          {currentStep >= 1 && (name || phone || email) && (
            <motion.div
              key="contact"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <h4 className="font-medium text-gray-900 flex items-center">
                <User className="h-4 w-4 mr-2 text-yellow-500" />
                Contact Details
              </h4>

              <div className="bg-gray-50 rounded-lg p-3 space-y-3 text-sm">

                {name && (
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{name}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{email}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Method - Visible from step 3 */}
        <AnimatePresence>
          {currentStep >= 2 && paymentMethod && (
            <motion.div
              key="payment"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <h4 className="font-medium text-gray-900 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-yellow-500" />
                Payment
              </h4>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {paymentMethod === "card" && <CreditCard className="h-4 w-4 text-gray-400" />}
                    {paymentMethod === "cash" && <DollarSign className="h-4 w-4 text-gray-400" />}
                    {paymentMethod === "paypal" && <Shield className="h-4 w-4 text-gray-400" />}
                    <span className="text-sm font-medium text-gray-900 capitalize">{paymentMethod}</span>
                  </div>
                  {selectedFare && <span className="text-lg font-bold text-gray-900">{selectedFare} €</span>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Status - Success step */}
        <AnimatePresence>
          {currentStep === 3 && isBookingComplete && (
            <motion.div
              key="status"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Booking Confirmed!</p>
                    <p className="text-sm text-green-700">Your ride has been successfully booked</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Total Summary - Always at bottom when fare is available */}
        <AnimatePresence>
          {selectedFare && currentStep < 3 && (
            <motion.div
              key="total"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="border-t border-gray-200 pt-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-2xl font-bold text-yellow-600">{selectedFare} €</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Estimated fare including taxes</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}