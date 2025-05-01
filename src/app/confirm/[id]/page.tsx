"use client"
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import ConfirmationSummary from "@/app/components/ConfirmationSummary";
import { Event } from "@/app/types/event";
import { useAuth } from "@/context/AuthContext";


export default function ConfirmationPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchEvent = async () => {
      try {
        const eventRef = doc(collection(db, "events"), id);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
          router.push("/");
          return;
        }

        const data = eventSnap.data();
        setEvent({ id, ...data } as Event);
      } catch (error) {
        console.error("Failed to load event:", error);
        router.push("/");
      }
    };

    fetchEvent();
  }, [id, router]);

  if (!user) return <p className="text-center py-12">Loading user info...</p>;
  if (!event) return <p className="text-center py-16 text-gray-500 dark:text-gray-400">Loading event details...</p>;

  const selectedDate = searchParams.get("date") || event.dates[0] || "N/A";
  const selectedTime = event.startTime || "TBD";
  const ticketQuantity = parseInt(searchParams.get("quantity") || "1", 10); 

  const totalAmount = event.price * ticketQuantity; 

  const handleProceedToPayment = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventTitle: event.title,
        userEmail: user.email,
        ticketQuantity,  
        pricePerTicket: event.price,  
      }),
    });
  
    const data = await res.json();
  
    if (data.url) {
      window.location.href = data.url;  
    } else {
      alert("Failed to initiate payment.");
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-16">
      <div className=" flex flex-col max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-10 space-y-10">
          <ConfirmationSummary
            eventTitle={event.title}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            location={event.location}
            image={event.image}
            price={event.price}
            ticketQuantity={ticketQuantity} 
            totalAmount={totalAmount}
          />
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Secure Payment</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click below to proceed to our secure payment gateway powered by Stripe.
            </p>
            <button
              onClick={handleProceedToPayment}
              className="w-full py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
