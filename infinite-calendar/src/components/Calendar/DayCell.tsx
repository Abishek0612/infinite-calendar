import React from "react";
import { Plus } from "lucide-react";
import { CalendarDate, JournalEntry } from "../../types";
import { JournalEntryCard } from "./JournalEntryCard";

interface DayCellProps {
  calendarDate: CalendarDate;
  onEntryClick: (entry: JournalEntry) => void;
  onDayClick: (date: Date) => void;
  isToday?: boolean;
}

export const DayCell: React.FC<DayCellProps> = React.memo(
  ({ calendarDate, onEntryClick, onDayClick, isToday = false }) => {
    const { date, isCurrentMonth, journalEntries } = calendarDate;
    const dayNumber = date.getDate();

    const handleDayClick = React.useCallback(() => {
      if (isCurrentMonth) {
        onDayClick(date);
      }
    }, [date, isCurrentMonth, onDayClick]);

    const handleEntryClick = React.useCallback(
      (entry: JournalEntry) => {
        onEntryClick(entry);
      },
      [onEntryClick]
    );

    return (
      <div
        className={`min-h-20 p-1 border-r border-b border-gray-100 ${
          !isCurrentMonth ? "bg-gray-50" : "bg-white"
        } group relative`}
      >
        <div
          className={`text-sm font-medium mb-1 flex items-center justify-between ${
            !isCurrentMonth
              ? "text-gray-400"
              : isToday
              ? "text-blue-600 font-bold"
              : "text-gray-700"
          }`}
        >
          {dayNumber}
          {isCurrentMonth && (
            <button
              onClick={handleDayClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-blue-50 rounded"
              title="Add entry for this day"
            >
              <Plus className="w-3 h-3 text-blue-600" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {journalEntries.map((entry, index) => (
            <JournalEntryCard
              key={`${entry.id}-${index}`}
              entry={entry}
              onClick={() => handleEntryClick(entry)}
            />
          ))}
        </div>
      </div>
    );
  }
);

DayCell.displayName = "DayCell";
