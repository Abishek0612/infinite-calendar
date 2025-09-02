import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
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
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  entries,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  onEdit,
  onDelete,
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

  const handleEdit = () => {
    onEdit(currentEntry);
    onClose();
  };

  const handleDelete = () => {
    onDelete(currentEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-lg">
        {/* Header with actions */}
        <div className="absolute -top-16 left-0 right-0 flex justify-between items-center text-white z-60">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
              title="Edit entry"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-600 bg-opacity-80 hover:bg-opacity-100 rounded-full transition-colors"
              title="Delete entry"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation  */}
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
