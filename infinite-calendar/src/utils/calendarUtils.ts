import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { CalendarDate, JournalEntry } from "../types";
import { getJournalEntriesForDate } from "./dateUtils";

export const getCalendarDays = (
  year: number,
  month: number,
  journalEntries: JournalEntry[]
): CalendarDate[] => {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map((date) => ({
    date,
    isCurrentMonth: date.getMonth() === month,
    journalEntries: getJournalEntriesForDate(date, journalEntries),
  }));
};

export const getMonthYearFromScroll = (
  scrollTop: number,
  monthHeight: number
): { year: number; month: number } => {
  const monthIndex = Math.floor(scrollTop / monthHeight);
  const currentDate = new Date();
  const year = currentDate.getFullYear() + Math.floor(monthIndex / 12);
  const month = monthIndex % 12;

  return { year, month };
};
