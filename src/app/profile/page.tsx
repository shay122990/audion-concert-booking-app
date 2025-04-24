"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

type Booking = {
  id: string;  
  eventId: string;
  selectedDate: string;
  bookedAt: string;
};

type EventDetails = {
  title: string;
  location: string;
  dates: string[];
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<(Booking & EventDetails)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const bookingsRef = collection(doc(db, "users", user.uid), "bookings");
        const snapshot = await getDocs(bookingsRef);

        const bookingData: Booking[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Booking[];

        const detailedBookings = await Promise.all(
          bookingData.map(async (booking) => {
            const eventRef = doc(db, "events", booking.eventId.trim());
            const eventSnap = await getDoc(eventRef);

            if (eventSnap.exists()) {
              const eventData = eventSnap.data() as EventDetails;
              return { ...booking, ...eventData };
            } else {
              return {
                ...booking,
                title: "Event Not Found",
                location: "Unknown",
                dates: []
              };
            }
          })
        );

        setBookings(detailedBookings);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleDeleteBooking = async (bookingId: string) => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "bookings", bookingId));
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      alert("Booking deleted successfully.");
    } catch (err) {
      console.error("❌ Failed to delete booking:", err);
      alert("Failed to delete booking. Please try again.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-purple-600 mb-8">My Profile</h1>

      <section className="flex flex-col sm:flex-row items-center gap-6 mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="w-28 h-28 relative rounded-full overflow-hidden">
          <Image
            src={user?.photoURL || "/shay250.png"}
            alt="Profile Picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">{user?.displayName || "Guest User"}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
                <h3 className="text-lg font-bold text-purple-600">{booking.title}</h3>

                {booking.title === "Event Not Found" ? (
                  <>
                    <p className="text-sm text-red-500 mt-2">
                      This event no longer exists. Please re-book.
                    </p>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete Booking
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">📅 {booking.selectedDate}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">📍 {booking.location}</p>
                    <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                      View Ticket
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Coming soon: favorite artists, categories, and notification settings.
        </p>
      </section>
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 dark:hover:bg-purple-900">
          Edit Profile
        </button>
        <button className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </main>
  );
}
