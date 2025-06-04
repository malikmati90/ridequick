import BookingSuccessContent from "@/components/booking/SuccessContent";
import { Suspense } from "react";

export default function BookingSuccessPage() {
  return (
    <Suspense>
      <BookingSuccessContent />
    </Suspense>
  );
}
