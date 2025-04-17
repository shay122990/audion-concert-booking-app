"use client";

import { useState } from "react";
import { saveBooking } from "@/app/lib/firebase"; 
import { Event } from "@/app/types/event"; 
import { User } from "firebase/auth";

type BookingFormProps = {
  event: Event;
  selectedDate: string;
  user: User;
};

export default function BookingForm({ event, selectedDate, user }: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleBooking = async () => {
    if (!user || !event || !selectedDate) return;

    try {
      setStatus("loading");

      await saveBooking({
        userId: user.uid,
        eventId: event.id || "",
        selectedDate,
      });

      setStatus("success");
    } catch (error) {
      console.error("Booking failed", error);
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 border p-6 rounded-lg bg-white dark:bg-gray-900 shadow">
      <h3 className="text-lg font-bold mb-2">Confirm your booking</h3>
      <p className="text-gray-600 dark:text-gray-300">You’re booking <strong>{event.title}</strong> on <strong>{selectedDate}</strong>.</p>
      <button
        onClick={handleBooking}
        disabled={status === "loading" || status === "success"}
        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {status === "loading" ? "Booking..." : status === "success" ? "✅ Booked!" : "Confirm Booking"}
      </button>

      {status === "error" && (
        <p className="text-red-500 mt-2">❌ Booking failed. Try again later.</p>
      )}
    </div>
  );
}
