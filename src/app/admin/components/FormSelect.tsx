"use client";

type FormSelectProps = {
  name: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function FormSelect({
  name,
  options,
  value,
  onChange,
}: FormSelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="px-4 py-2 rounded border"
      required
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
