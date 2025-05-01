"use client"
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
  const [ticketQuantity, setTicketQuantity] = useState(1);
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

  const handleTicketQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Math.max(1, parseInt(event.target.value)); 
    setTicketQuantity(quantity);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 mt-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105 h-auto"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-purple-600">{event.title}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>

          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <p>📍 {event.location}</p>
            <p>🕗 Doors Open: {event.doorsOpenTime} | Starts: {event.startTime} | Ends: {event.endTime}</p>
            <p className="text-lg font-semibold text-purple-600 mt-4">
              Ticket Price: ${event.price}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select a date:</h3>
            <DateSelector
              dates={event.dates}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Ticket Quantity:</h3>
            <input
              type="number"
              min="1"
              value={ticketQuantity}
              onChange={handleTicketQuantityChange}
              className="w-24 p-2 border border-gray-300 dark:border-gray-700 rounded-lg"
            />
            <span className="ml-2 text-sm text-gray-500">Tickets</span>
          </div>

          <div className="mt-6">
            {!user ? (
              <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg text-yellow-800 text-center shadow-sm">
                Please{" "}
                <button
                  onClick={signInWithGoogle}
                  className="text-purple-600 underline font-semibold"
                >
                  log in
                </button>{" "}
                to book this event.
              </div>
            ) : (
              <BookingForm
                event={event}
                selectedDate={selectedDate}
                user={user}
                ticketQuantity={ticketQuantity} 
              />
            )}
          </div>
        </div>
      </div>

      {event.lineup?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">🎤 Lineup</h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 list-disc list-inside">
              {event.lineup.map((artist, i) => (
                <li key={i}>{artist}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
