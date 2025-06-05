'use client'

import { useLoadScript } from "@react-google-maps/api";
import BookingForm from "./booking-form";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAK!;
const libraries: ("places")[] = ["places"];

export default function BookingFormWrapper() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return <div className="text-red-600">Failed to load Google Maps API</div>;

  return (
    <div style={{ minHeight: "450px" }}> {/* approximate height of the final form */}
      {isLoaded ? <BookingForm /> : (
        <div className="w-full h-full animate-pulse bg-white/10 rounded-lg" />
      )}
    </div>
  );
}
