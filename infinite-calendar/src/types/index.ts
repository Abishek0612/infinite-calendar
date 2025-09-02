export interface JournalEntry {
  id: string;
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

export interface JournalFormData {
  imgUrl: string;
  rating: number;
  categories: string[];
  date: string;
  description: string;
}

export interface CalendarActions {
  onAddEntry: (date: Date) => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (entry: JournalEntry) => void;
}
