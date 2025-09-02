import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { JournalEntry } from "../../types";
import { SwipeableCard } from "./SwipeableCard";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";

interface JournalModalProps {
  entries: JournalEntry[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  entries,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}) => {
  useKeyboardNavigation({
    onArrowLeft: onPrevious,
    onArrowRight: onNext,
    onEscape: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || entries.length === 0) return null;

  const currentEntry = entries[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < entries.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-60"
        >
          <X className="w-8 h-8" />
        </button>

        {canGoPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-60"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {canGoNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg z-60"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <SwipeableCard
          entry={currentEntry}
          onSwipeLeft={canGoNext ? onNext : undefined}
          onSwipeRight={canGoPrevious ? onPrevious : undefined}
          currentIndex={currentIndex}
          totalEntries={entries.length}
        />
      </div>
    </div>
  );
};
