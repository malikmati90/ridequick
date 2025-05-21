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

  if (loadError) return <div>Failed to load Google Maps API</div>;
  if (!isLoaded) return;

  return <BookingForm />;
}