"use client";

import React, { useRef } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";

type TicketModalProps = {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    title: string;
    selectedDate: string;
    location: string;
    bookedAt: string;
  };
};

export default function TicketModal({ isOpen, onClose, booking }: TicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: "#ffffff",
        useCORS: true
      });
      const link = document.createElement("a");
      link.download = `ticket-${booking.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error("❌ Failed to generate ticket image:", err);
      alert("Failed to download ticket. Please try again.");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div ref={ticketRef} style={ticketContentStyle}>
          <h2 style={{ fontSize: "20px", marginBottom: "8px", color: "#6b21a8" }}>{booking.title}</h2>
          <p style={{ margin: "4px 0" }}>📅 {booking.selectedDate}</p>
          <p style={{ margin: "4px 0" }}>📍 {booking.location}</p>

          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking-${booking.id}`}
            alt="QR Code"
            width={150}
            height={150}
            style={{ margin: "16px auto" }}
          />

          <p style={{ fontSize: "12px", marginTop: "8px" }}>Ref: {booking.id}</p>
          <p style={{ fontSize: "12px" }}>
            Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Download Ticket
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 border border-gray-400 rounded hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline Styles for Overlay and Modal (Safe)
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 50
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "350px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
};

const ticketContentStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#000000",
  padding: "16px",
  borderRadius: "8px",
  fontFamily: "Arial, sans-serif"
};
