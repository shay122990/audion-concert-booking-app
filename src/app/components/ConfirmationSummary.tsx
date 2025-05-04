import Image from "next/image";

type Props = {
  eventTitle: string;
  selectedDate: string;
  selectedTime: string;
  location: string;
  image: string;
  price: number;
  ticketQuantity: number;
  totalAmount: number;
};

export default function ConfirmationSummary({
  eventTitle,
  selectedDate,
  selectedTime,
  location,
  image,
  ticketQuantity,
  totalAmount,
}: Props) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
        {eventTitle}
      </h2>

      <div className="relative w-60 h-60 mb-6 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
        <Image
          src={image}
          alt={eventTitle}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div>
          <span className="font-medium">Date:</span> {selectedDate}
        </div>
        <div>
          <span className="font-medium">Time:</span> {selectedTime}
        </div>
        <div>
          <span className="font-medium">Location:</span> {location}
        </div>
        <div>
          <span className="font-medium">Tickets:</span> {ticketQuantity}
        </div>
        <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-4">
          Total: ${totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
