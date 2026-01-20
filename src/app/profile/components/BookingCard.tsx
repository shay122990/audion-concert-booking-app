"use client";

import React from "react";

export type FullBooking = {
  id: string;
  eventId: string;
  selectedDate: string;
  bookedAt: string;
  userId?: string;
  userEmail?: string;

  title: string;
  location: string;
  dates: string[];
};

type BookingCardProps = {
  booking: FullBooking;
  isEditable: boolean;
  isAdmin: boolean;

  onViewTicket?: (booking: FullBooking) => void;
  onDelete?: (booking: FullBooking) => void;
};

export default function BookingCard({
  booking,
  isEditable,
  isAdmin,
  onViewTicket,
  onDelete,
}: BookingCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900">
      <h3 className="text-lg font-bold text-purple-600">{booking.title}</h3>

      {isAdmin && !isEditable && (
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
            type="button"
            onClick={() => onViewTicket?.(booking)}
            className="px-2 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            View Ticket
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(booking)}
            className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Booking
          </button>
        </div>
      )}
    </div>
  );
}
