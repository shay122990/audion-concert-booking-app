"use client";

import { ChangeEvent } from "react";

interface DatePickerInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  availableDates?: string[];
}

export default function DatePickerInput({
  label = "Select a date",
  value,
  onChange,
  availableDates = [],
}: DatePickerInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (availableDates.includes(newValue)) {
      onChange(newValue);
    } else {
      alert("❌ This date is not available for this event.");
    }
  };

  const min = availableDates[0];
  const max = availableDates[availableDates.length - 1];

  return (
    <div className="mb-6">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className="px-4 py-2 rounded border w-full max-w-xs dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}
