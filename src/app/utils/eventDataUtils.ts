import { Event } from "@/app/types/event";

export const parseCommaSeparatedString = (input: string): string[] =>
  input.split(",").map((s) => s.trim());

export const buildEventFromFormData = (formData: FormData): Event => ({
  id: "",
  title: formData.get("title") as string,
  dates: parseCommaSeparatedString(formData.get("dates") as string),
  doorsOpenTime: formData.get("doorsOpenTime") as string,
  startTime: formData.get("startTime") as string,
  endTime: formData.get("endTime") as string,
  location: formData.get("location") as string,
  image: formData.get("image") as string,
  category: formData.get("category") as string,
  description: formData.get("description") as string,
  lineup: parseCommaSeparatedString(formData.get("lineup") as string),
  price: Number(formData.get("price")) || 0,
});
