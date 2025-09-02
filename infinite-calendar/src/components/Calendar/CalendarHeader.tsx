import React from "react";
import { formatDate } from "../../utils/dateUtils";

interface CalendarHeaderProps {
  currentDate: Date;
  isAnimating?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  isAnimating = false,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold text-gray-800">My Hair Diary</h1>
        <div
          className={`text-lg font-medium text-gray-700 transition-all duration-300 ${
            isAnimating ? "animate-fade-in" : ""
          }`}
        >
          {formatDate(currentDate)}
        </div>
      </div>
    </div>
  );
};
