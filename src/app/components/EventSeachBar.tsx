"use client";

import { ChangeEvent, useState } from "react";

type EventItem = {
  [key: string]: string | string[] | undefined;
};

type EventSearchBarProps<T extends EventItem> = {
  data: T[];
  onFilter: (results: T[]) => void;
  keysToSearch: (keyof T)[];
  placeholder?: string;
};

export default function EventSearchBar<T extends EventItem>({
  data,
  onFilter,
  keysToSearch,
  placeholder = "Search event...",
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
