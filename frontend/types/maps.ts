import { PlaneIcon, HotelIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"


export const placeTypeIcons: Record<"airport" | "hotel", LucideIcon> = {
  airport: PlaneIcon,
  hotel: HotelIcon,
}

export type PlaceResult = {
    formattedAddress: string
    name?: string
    lat: number
    lng: number
    types?: string[]
};
  