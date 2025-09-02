import React from "react";
import { MonthData } from "../../types";
import { DayCell } from "./DayCell";
import { isSameDay } from "date-fns";

interface MonthGridProps {
  monthData: MonthData;
  onEntryClick: (entryIndex: number) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MonthGrid: React.FC<MonthGridProps> = ({
  monthData,
  onEntryClick,
}) => {
  const today = new Date();

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
            key={index}
            calendarDate={calendarDate}
            onEntryClick={onEntryClick}
            isToday={isSameDay(calendarDate.date, today)}
          />
        ))}
      </div>
    </div>
  );
};
