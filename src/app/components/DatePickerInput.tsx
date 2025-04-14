"use client";

import { ChangeEvent } from "react";

interface DatePickerInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

export default function DatePickerInput({
  label = "Select a date",
  value,
  onChange,
  min,
  max,
}: DatePickerInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-6">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className="px-4 py-2 rounded border w-full max-w-xs"
      />
    </div>
  );
}
