"use client";

interface DateSelectorProps {
  dates: string[];
  selectedDate: string;
  onSelect: (date: string) => void;
}

export default function DateSelector({ dates, selectedDate, onSelect }: DateSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => onSelect(date)}
          className={`px-4 py-2 rounded border text-sm font-medium transition
            ${selectedDate === date
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
          `}
        >
          {date}
        </button>
      ))}
    </div>
  );
}
