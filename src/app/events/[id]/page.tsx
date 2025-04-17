"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Event } from "@/app/types/event";
import { useAuth } from "@/context/AuthContext";
import BookingForm from "@/app/components/BookingForm";
import DateSelector from "@/app/components/DateSelector";
export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchEvent = async () => {
      try {
        const eventRef = doc(collection(db, "events"), id);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const eventData = eventSnap.data() as Event;
          setEvent({ ...eventData, id: eventSnap.id });
          if (eventData.dates?.length) {
            setSelectedDate(eventData.dates[0]);
          }
        } else {
          router.push("/not-found");
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading event...</div>;
  }

  if (!event) {
    return <div className="p-8 text-center text-red-500">Event not found.</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="relative w-full lg:w-1/2 h-96 rounded-lg overflow-hidden shadow-md">
          <Image src={event.image} alt={event.title} fill className="object-cover" />
        </div>
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold text-purple-600 mb-4">{event.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">📍 {event.location}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">🕗 Doors Open: {event.doorsOpenTime} | Starts: {event.startTime} | Ends: {event.endTime}</p>
          
          <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select a date:</h3>
          <DateSelector
            dates={event.dates}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>
          <div className="mt-6">
            {!user ? (
              <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-md text-yellow-800 text-center">
                Please{" "}
                <button
                  onClick={signInWithGoogle}
                  className="text-purple-600 underline"
                >
                  log in
                </button>{" "}
                to book this event.
              </div>
            ) : (
              <BookingForm event={event} selectedDate={selectedDate} user={user} />
            )}
          </div>
        </div>
      </div>

      {event.lineup?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">🎤 Lineup</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {event.lineup.map((artist, i) => (
              <li key={i}>{artist}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
