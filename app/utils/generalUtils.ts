import { ContentItem } from "../interfaces";

export const getReadTime = (content: ContentItem[]): number => {
  const averageReadingSpeed = 200; // words per minute
  let totalWords = 0;

  content.forEach(item => {
    if (item.type === "text") {
      totalWords += item.value.split(/\s+/).length;
    }
  });
  const readingTimeMinutes = totalWords / averageReadingSpeed;
  return Math.ceil(readingTimeMinutes); // rounding up to the nearest minute
};

export const dateToBeauty = (dateRaw: string): string => {
  const date = new Date(dateRaw);
  const dateNow = new Date();
  const diffInMs = dateNow.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes === 0) {
    return `now`;
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  if (diffInMinutes < 1440) { // 24 hours * 60 minutes
    return `${diffInHours}h ago`;
  }

  const day = date.getDate();
  const month = date.toLocaleString('es', { month: 'short' });
  return `${day} ${month}`;
};