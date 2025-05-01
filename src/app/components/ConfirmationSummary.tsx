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
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">{eventTitle}</h2>
      <Image
        src={image}
        alt={eventTitle}
        width={500}
        height={500}
        className="rounded-md mb-6" 
      />
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">Date: {selectedDate}</p>
        <p className="text-gray-700 dark:text-gray-300">Time: {selectedTime}</p>
        <p className="text-gray-700 dark:text-gray-300">Location: {location}</p>
        <p className="text-gray-700 dark:text-gray-300">Tickets: {ticketQuantity}</p>
        <p className="text-lg font-semibold text-purple-600">
          Total Price: ${totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
