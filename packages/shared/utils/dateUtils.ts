import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with plugins
dayjs.extend(relativeTime);

export const formatDate = (
  date: string | Date,
  format: string = "MMM D, YYYY",
): string => {
  return dayjs(date).format(format);
};

export const formatTime = (
  date: string | Date,
  format: string = "h:mm A",
): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (
  date: string | Date,
  format: string = "MMM D, YYYY h:mm A",
): string => {
  return dayjs(date).format(format);
};

export const getRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), "day");
};

export const isTomorrow = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().add(1, "day"), "day");
};

export const isYesterday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, "day"), "day");
};

export const getTimeRemaining = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);

  if (target.isBefore(now)) {
    return "Past due";
  }

  const hours = target.diff(now, "hour");
  const minutes = target.diff(now, "minute") % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  return `${minutes}m remaining`;
};
