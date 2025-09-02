import React from "react";
import { JournalEntry } from "../../types";
import { useSwipeGestures } from "../../hooks/useSwipeGestures";
import { Star } from "lucide-react";

interface SwipeableCardProps {
  entry: JournalEntry;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  currentIndex: number;
  totalEntries: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  entry,
  onSwipeLeft,
  onSwipeRight,
  currentIndex,
  totalEntries,
}) => {
  const swipeGestures = useSwipeGestures({
    onSwipeLeft,
    onSwipeRight,
    threshold: 50,
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div
      className="w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-xl animate-slide-in"
      {...swipeGestures}
    >
      <div className="relative">
        <img
          src={entry.imgUrl}
          alt="Journal entry"
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1">
          <div className="flex">{renderStars(entry.rating)}</div>
        </div>
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {totalEntries}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-1 mb-3">
          {entry.categories.map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
        </div>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {entry.description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{entry.date}</span>
          <div className="flex space-x-2">
            {onSwipeRight && <span>← Previous</span>}
            {onSwipeLeft && <span>Next →</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
