import React from "react";
import { MonthData } from "../../types";
import { DayCell } from "./DayCell";
import { isSameDay } from "date-fns";

interface MonthGridProps {
  monthData: MonthData;
  onEntryClick: (entryIndex: number, monthData: MonthData) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MonthGrid: React.FC<MonthGridProps> = React.memo(
  ({ monthData, onEntryClick }) => {
    const today = new Date();

    const handleEntryClick = React.useCallback(
      (entryIndex: number) => {
        onEntryClick(entryIndex, monthData);
      },
      [onEntryClick, monthData]
    );

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 grid grid-cols-7 border-b border-gray-200">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-semibold text-gray-600 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {monthData.dates.map((calendarDate, index) => (
            <DayCell
              key={`${monthData.year}-${monthData.month}-${index}`}
              calendarDate={calendarDate}
              onEntryClick={handleEntryClick}
              isToday={isSameDay(calendarDate.date, today)}
            />
          ))}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.monthData.year === nextProps.monthData.year &&
      prevProps.monthData.month === nextProps.monthData.month &&
      prevProps.monthData.dates.length === nextProps.monthData.dates.length
    );
  }
);

MonthGrid.displayName = "MonthGrid";
