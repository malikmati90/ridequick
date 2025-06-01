
export enum VehicleCategory {
    Economy = "economy",
    Standard = "standard",
    Premium = "premium"
};
  
  
export type BookingEstimateRequest = {
    distance_km: number
    duration_minutes: number
    scheduled_time: string // ISO string format
    passenger_count: number
    is_airport?: boolean
    is_holiday?: boolean
};


export type BookingEstimateResponse = {
    category: VehicleCategory
    estimated_fare: number
}; 

export type FareEstimateWithMeta = {
    fareEstimates: BookingEstimateResponse[]
    estimatedDistance: number
    estimatedDuration: number
};

  
export type CreateSessionParams = {
    name: string
    email: string
    phone: string
    price: number
    selected_vehicle: string
    passengers: number
    pickup_location: string | undefined
    destination: string | undefined
    scheduled_time: string
    estimatedDistance: number
    estimatedDuration: number
  }