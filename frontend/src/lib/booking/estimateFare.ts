import { baseUrl } from '@/lib/definitions'
import { BookingEstimateRequest, BookingEstimateResponse } from '../../../types/booking'


export async function estimateFare({
    pickupLocation,
    destination,
    passengers,
    scheduledTime,
    isAirport = false,
    isHoliday = false,
  }: {
    pickupLocation: string
    destination: string
    passengers: number
    scheduledTime: Date
    isAirport?: boolean
    isHoliday?: boolean
  }): Promise<BookingEstimateResponse[]> {

    // Call backend directions endpoint
    const directionsRes = await fetch(baseUrl +
      `/api/directions?origin=${encodeURIComponent(pickupLocation)}&destination=${encodeURIComponent(destination)}`
    )
  
    if (!directionsRes.ok) {
      throw new Error("Failed to fetch directions")
    }
  
    const { distance_km, duration_min } = await directionsRes.json()
  
    // Call booking estimate API endpoint
    const requestBody: BookingEstimateRequest = {
        distance_km,
        duration_minutes: Math.round(duration_min),
        scheduled_time: scheduledTime.toISOString(),
        passenger_count: passengers,
        is_airport: isAirport,
        is_holiday: isHoliday,
    }

    const estimateRes = await fetch(baseUrl + "/bookings/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
  
    if (!estimateRes.ok) {
      throw new Error("Failed to estimate fare")
    }
  
    const fareEstimates: BookingEstimateResponse[] = await estimateRes.json()
    return fareEstimates
  }