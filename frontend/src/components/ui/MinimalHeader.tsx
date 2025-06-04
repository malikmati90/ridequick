import Link from "next/link";
import { MapPin } from "lucide-react";

export const MinimalHeader = () => {
  return (
    <header className="py-4 px-6 sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-semibold">RideQuick</span>
        </Link>
      </div>
    </header>
  );
};
