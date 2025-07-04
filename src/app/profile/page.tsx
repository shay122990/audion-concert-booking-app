"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import TicketModal from "@/app/components/TicketModal";
import Modal from "@/app/components/Modal";

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
  const [selectedBooking, setSelectedBooking] = useState<
    (Booking & EventDetails) | null
  >(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);
  const onConfirmRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const bookingsRef = collection(doc(db, "users", user.uid), "bookings");
        const snapshot = await getDocs(bookingsRef);

        const bookingData: Booking[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
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
                dates: [],
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

  const handleDeleteBooking = (bookingId: string) => {
    if (!user) return;

    onConfirmRef.current = async () => {
      try {
        await deleteDoc(doc(db, "users", user.uid, "bookings", bookingId));
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));

        setModalTitle("Success");
        setModalContent(<p>✅ Booking deleted successfully.</p>);
        setModalFooter(
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            OK
          </button>
        );
      } catch (err) {
        console.error("❌ Failed to delete booking:", err);
        setModalTitle("Error");
        setModalContent(
          <p>❌ Failed to delete booking. Please try again later.</p>
        );
        setModalFooter(
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Close
          </button>
        );
      } finally {
        setIsModalOpen(true);
      }
    };

    setModalTitle("Confirm Deletion");
    setModalContent(<p>Are you sure you want to delete this booking?</p>);
    setModalFooter(
      <>
        <button
          onClick={async () => {
            if (onConfirmRef.current) await onConfirmRef.current();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Confirm
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </>
    );
    setIsModalOpen(true);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 mt-22 lg:mt-28 mb-10">
      <h1 className="text-3xl font-bold text-purple-600 mb-8">My Profile</h1>

      {user ? (
        <>
          <section className="flex flex-row items-center gap-6 mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="w-28 h-28 relative rounded-full overflow-hidden">
              <Image
                src={user.photoURL || "/shay250.png"}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">
                {user.displayName || "Guest User"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>

            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">
                Loading your bookings...
              </p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                You have no bookings yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900"
                  >
                    <h3 className="text-lg font-bold text-purple-600">
                      {booking.title}
                    </h3>

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
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📅 {booking.selectedDate}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📍 {booking.location}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowTicketModal(true);
                          }}
                          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          View Ticket
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {selectedBooking && (
            <TicketModal
              isOpen={showTicketModal}
              onClose={() => setShowTicketModal(false)}
              booking={selectedBooking}
            />
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalTitle}
            footer={modalFooter}
          >
            {modalContent}
          </Modal>
        </>
      ) : (
        <section className="flex flex-col items-center justify-center text-center gap-6 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-purple-600">
            Please sign in to view your bookings
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            You need an account to see your profile and booking history.
          </p>
        </section>
      )}
    </main>
  );
}
