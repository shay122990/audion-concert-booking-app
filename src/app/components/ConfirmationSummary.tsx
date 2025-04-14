import Image from "next/image";

type Props = {
  eventTitle: string;
  selectedDate: string;
  selectedTime: string;
  location: string;
  image: string;
};

export default function ConfirmationSummary({
  eventTitle,
  selectedDate,
  selectedTime,
  location,
  image,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <Image
        src={image}
        alt={eventTitle}
        width={800}
        height={400}
        className="rounded-lg mb-6 object-cover w-full h-64"
      />
      <h1 className="text-3xl font-bold mb-2">{eventTitle}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-1">📍 {location}</p>
      <p className="text-gray-600 dark:text-gray-400 mb-1">📅 {selectedDate}</p>
      <p className="text-gray-600 dark:text-gray-400 mb-6">⏰ {selectedTime}</p>

      <p className="text-lg text-gray-800 dark:text-gray-300">
        Please confirm your selection and continue to complete the booking.
      </p>
    </div>
  );
}
