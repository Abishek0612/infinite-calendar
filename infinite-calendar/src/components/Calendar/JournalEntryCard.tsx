import React from "react";
import { JournalEntry } from "../../types";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onClick,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xs ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div
      onClick={onClick}
      className="relative w-12 h-12 cursor-pointer group transform transition-transform hover:scale-105"
    >
      <img
        src={entry.imgUrl}
        alt="Journal entry"
        className="w-full h-full object-cover rounded-lg shadow-sm"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200" />
      <div className="absolute -top-1 -right-1 bg-white rounded-full px-1 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex">{renderStars(entry.rating)}</div>
      </div>
    </div>
  );
};

export {};
