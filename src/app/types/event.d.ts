export type Event={
  // [key: string]: string | string[] | undefined;
  id: string;
  title: string;
  dates: string[];
  doorsOpenTime: string;
  startTime: string;
  endTime: string;
  location: string;
  image: string;
  category: string;
  description: string;
  lineup: string[];
  price: number; 
}