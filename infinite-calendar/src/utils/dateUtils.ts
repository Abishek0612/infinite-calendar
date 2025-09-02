import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { JournalEntry } from "../types";

export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

export const formatDate = (date: Date): string => {
  return format(date, "MMMM yyyy");
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end });
};

export const getJournalEntriesForDate = (
  date: Date,
  entries: JournalEntry[]
): JournalEntry[] => {
  return entries.filter((entry) => {
    const entryDate = parseDate(entry.date);
    return isSameDay(date, entryDate);
  });
};

export const getAllJournalEntries = (): JournalEntry[] => {
  return [];
};
