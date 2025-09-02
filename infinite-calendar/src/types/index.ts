export interface JournalEntry {
  imgUrl: string;
  rating: number;
  categories: string[];
  date: string;
  description: string;
}

export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  journalEntries: JournalEntry[];
}

export interface MonthData {
  year: number;
  month: number;
  dates: CalendarDate[];
}
