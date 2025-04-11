export interface Event extends EventItem {
    [key: string]: string | string[] | undefined;
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    category: string;
    description: string;
    lineup: string[];
  }
  