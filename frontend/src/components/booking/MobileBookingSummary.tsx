"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import BookingSummary from "./BookingSummary"; // reuse same component

export default function MobileBookingSummary() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg shadow hover:bg-yellow-100 transition"
      >
        <span className="flex items-center font-medium">
          <Info className="w-4 h-4 mr-2" />
          {isOpen ? "Hide" : "Show"} Booking Summary
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="mt-4">
          <BookingSummary />
        </div>
      )}
    </div>
  );
}
