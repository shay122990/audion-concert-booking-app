"use client";

import { db } from "@/app/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns";

type EventData = {
  id: string;
  title: string;
  date: string; // or consider: dates: string[]
  time?: string; // optional
  location: string;
  image: string;
  category: string;
  description?: string;// to be added 
  lineup?: string[];//to be added in the future
};


export default function EventDetailsPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchEvent = async () => {
      const eventRef = doc(collection(db, "events"), id);
      const eventSnap = await getDoc(eventRef);

      if (!eventSnap.exists()) {
        notFound(); 
        return;
      }

      const data = eventSnap.data();
      setEvent(data as EventData);
      setSelectedDate(data.date);
    };

    fetchEvent();
  }, [id]);

  const handleBooking = () => {
    router.push(`/confirm/${id}?date=${selectedDate}`);
  };

  if (!event) return <p className="text-center py-12">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Image
          src={event.image}
          alt={event.title}
          width={800}
          height={400}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        📍 {event.location} • 📅 {format(new Date(event.date), "MMMM d, yyyy")}
      </p>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Get ready for an unforgettable experience at <strong>{event.title}</strong>! Reserve your
        spot now before tickets sell out.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Select a date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded border w-full max-w-xs"
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={!selectedDate}
        className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50"
      >
        Continue to Booking
      </button>
    </main>
  );
}
