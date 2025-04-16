export interface Event extends EventItem {
    [key: string]: string | string[] | undefined;
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
  }
  