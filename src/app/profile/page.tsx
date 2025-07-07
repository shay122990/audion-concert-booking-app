"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  collectionGroup,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import Image from "next/image";
import TicketModal from "@/app/components/TicketModal";
import Modal from "@/app/components/Modal";

type Booking = {
  id: string;
  eventId: string;
  selectedDate: string;
  bookedAt: string;
  userId?: string;
  userEmail?: string;
};

type EventDetails = {
  title: string;
  location: string;
  dates: string[];
};

type FullBooking = Booking & EventDetails;

export default function ProfilePage() {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [myBookings, setMyBookings] = useState<FullBooking[]>([]);
  const [otherBookings, setOtherBookings] = useState<FullBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<FullBooking | null>(
    null
  );
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);
  const onConfirmRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || roleLoading) return;

      try {
        const userSnapshot = await getDocs(
          collection(doc(db, "users", user.uid), "bookings")
        );
        const myDetailed = await Promise.all(
          userSnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const eventSnap = await getDoc(doc(db, "events", data.eventId));
            const eventData = eventSnap.exists()
              ? (eventSnap.data() as EventDetails)
              : { title: "Event Not Found", location: "Unknown", dates: [] };

            return {
              id: docSnap.id,
              eventId: data.eventId,
              selectedDate: data.selectedDate,
              bookedAt: data.bookedAt,
              userId: user.uid,
              userEmail: user.email ?? "",
              ...eventData,
            };
          })
        );
        setMyBookings(myDetailed);

        if (role === "admin") {
          const all = await getDocs(collectionGroup(db, "bookings"));
          const otherDetailed = await Promise.all(
            all.docs
              .filter((d) => d.ref.parent.parent?.id !== user.uid)
              .map(async (docSnap) => {
                const data = docSnap.data();
                const userId = docSnap.ref.parent.parent?.id;
                const userDoc = await getDoc(doc(db, "users", userId!));
                const userEmail = userDoc.exists()
                  ? userDoc.data().email ?? ""
                  : "Unknown";

                const eventSnap = await getDoc(doc(db, "events", data.eventId));
                const eventData = eventSnap.exists()
                  ? (eventSnap.data() as EventDetails)
                  : {
                      title: "Event Not Found",
                      location: "Unknown",
                      dates: [],
                    };

                return {
                  id: docSnap.id,
                  eventId: data.eventId,
                  selectedDate: data.selectedDate,
                  bookedAt: data.bookedAt,
                  userId,
                  userEmail,
                  ...eventData,
                };
              })
          );
          setOtherBookings(otherDetailed);
        }
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, role, roleLoading]);

  const handleDeleteBooking = (booking: FullBooking) => {
    onConfirmRef.current = async () => {
      try {
        await deleteDoc(
          doc(db, "users", booking.userId!, "bookings", booking.id)
        );
        setMyBookings((prev) => prev.filter((b) => b.id !== booking.id));

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
        setModalContent(<p>❌ Could not delete booking. Try again later.</p>);
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

  const renderBookingCard = (booking: FullBooking, isEditable: boolean) => (
    <div
      key={booking.id}
      className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900"
    >
      <h3 className="text-lg font-bold text-purple-600">{booking.title}</h3>
      {role === "admin" && !isEditable && (
        <p className="text-sm text-gray-500">👤 {booking.userEmail}</p>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        📅 {booking.selectedDate}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        📍 {booking.location}
      </p>

      {booking.title === "Event Not Found" && (
        <p className="text-sm text-red-500 mt-2">Event no longer exists.</p>
      )}

      {isEditable && (
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => {
              setSelectedBooking(booking);
              setShowTicketModal(true);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            View Ticket
          </button>
          <button
            onClick={() => handleDeleteBooking(booking)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Booking
          </button>
        </div>
      )}
    </div>
  );

  if (!user && !roleLoading) {
    return (
      <main className="max-w-5xl mx-auto px-6 mt-22 lg:mt-28 mb-10">
        <section className="flex flex-col items-center justify-center text-center gap-6 bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-purple-600">
            Please sign in
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            You need to sign in to view your bookings and profile.
          </p>
        </section>
      </main>
    );
  }

  if (loading || roleLoading) {
    return <p className="text-center py-16">Loading...</p>;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 mt-22 lg:mt-28 mb-10">
      <h1 className="text-3xl font-bold text-purple-600 mb-8">My Profile</h1>

      <section className="flex flex-row items-center gap-6 mb-12 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="w-28 h-28 relative rounded-full overflow-hidden">
          <Image
            src={user?.photoURL || "/shay250.png"}
            alt="Profile Picture"
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">
            {user?.displayName || "Guest User"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
          {role === "admin" && (
            <p className="text-xs text-purple-600 font-medium mt-1">
              Role: Admin
            </p>
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
        {myBookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You have no bookings yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBookings.map((b) => renderBookingCard(b, true))}
          </div>
        )}
      </section>

      {role === "admin" && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            All Other Users’ Bookings
          </h2>
          {otherBookings.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No other bookings found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherBookings.map((b) => renderBookingCard(b, false))}
            </div>
          )}
        </section>
      )}

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
    </main>
  );
}
