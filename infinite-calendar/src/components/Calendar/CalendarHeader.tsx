import React from "react";
import { Plus, Download, Upload } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

interface CalendarHeaderProps {
  currentDate: Date;
  isAnimating?: boolean;
  onAddEntry: () => void;
  onExportEntries: () => void;
  onImportEntries: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  isAnimating = false,
  onAddEntry,
  onExportEntries,
  onImportEntries,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold text-gray-800">My Hair Diary</h1>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={onImportEntries}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Import entries"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={onExportEntries}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export entries"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div
            className={`text-lg font-medium text-gray-700 transition-all duration-300 ${
              isAnimating ? "animate-fade-in" : ""
            }`}
          >
            {formatDate(currentDate)}
          </div>

          <button
            onClick={onAddEntry}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
