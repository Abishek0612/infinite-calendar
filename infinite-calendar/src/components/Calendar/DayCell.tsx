import React from "react";
import { CalendarDate } from "../../types";
import { JournalEntryCard } from "./JournalEntryCard";

interface DayCellProps {
  calendarDate: CalendarDate;
  onEntryClick: (entryIndex: number) => void;
  isToday?: boolean;
}

export const DayCell: React.FC<DayCellProps> = React.memo(
  ({ calendarDate, onEntryClick, isToday = false }) => {
    const { date, isCurrentMonth, journalEntries } = calendarDate;
    const dayNumber = date.getDate();

    return (
      <div
        className={`min-h-20 p-1 border-r border-b border-gray-100 ${
          !isCurrentMonth ? "bg-gray-50" : "bg-white"
        }`}
      >
        <div
          className={`text-sm font-medium mb-1 ${
            !isCurrentMonth
              ? "text-gray-400"
              : isToday
              ? "text-blue-600 font-bold"
              : "text-gray-700"
          }`}
        >
          {dayNumber}
        </div>
        <div className="flex flex-wrap gap-1">
          {journalEntries.map((entry, index) => (
            <JournalEntryCard
              key={`${entry.date}-${index}`}
              entry={entry}
              onClick={() => onEntryClick(index)}
            />
          ))}
        </div>
      </div>
    );
  }
);

DayCell.displayName = "DayCell";
