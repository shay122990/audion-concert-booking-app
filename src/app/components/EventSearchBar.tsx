"use client";

import { ChangeEvent, useState } from "react";

type EventSearchBarProps<T> = {
  data: T[];
  onFilter: (results: T[]) => void;
  keysToSearch: (Array<keyof T>);
  placeholder?: string;
};

export default function EventSearchBar<T>({
  data,
  onFilter,
  keysToSearch,
  placeholder = "Search event by title, location, category, description or lineup",
}: EventSearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = data.filter((item) =>
      keysToSearch.some((key) => {
        const field = item[key];
        if (typeof field === "string") {
          return field.toLowerCase().includes(value.toLowerCase());
        } else if (Array.isArray(field)) {
          return field.some((str) =>
            str.toLowerCase().includes(value.toLowerCase())
          );
        }
        return false;
      })
    );

    onFilter(filtered);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleSearch}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded border mb-6"
    />
  );
}
