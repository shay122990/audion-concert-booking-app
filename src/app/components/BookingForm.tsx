"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBooking } from "@/app/lib/firebase";
import { Event } from "@/app/types/event";
import { User } from "firebase/auth";

type BookingFormProps = {
  event: Event;
  selectedDate: string;
  user: User;
};

export default function BookingForm({ event, selectedDate, user }: BookingFormProps) {
  const [hasBooked, setHasBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    if (!user || !event || !selectedDate) return;

    try {
      setLoading(true);

      await saveBooking({
        userId: user.uid,
        eventId: event.id,
        selectedDate,
      });

      setHasBooked(true);
    } catch (error) {
      console.error("Booking failed", error);
      alert("❌ Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    router.push(`/confirm/${event.id}?date=${selectedDate}`);
  };

  return (
    <div className="mt-6 border p-6 rounded-lg bg-white dark:bg-gray-900 shadow">
      <h3 className="text-lg font-bold mb-2">Book your spot</h3>
      <p className="text-gray-600 dark:text-gray-300">
        You&apos;re booking <strong>{event.title}</strong> on <strong>{selectedDate}</strong>.
      </p>

      {!hasBooked ? (
        <button
          onClick={handleBooking}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book Event"}
        </button>
      ) : (
        <button
          onClick={handleProceed}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );
}
