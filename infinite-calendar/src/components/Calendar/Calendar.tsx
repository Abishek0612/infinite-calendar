import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  startTransition,
} from "react";
import { addMonths, subMonths, isSameMonth } from "date-fns";
import { CalendarHeader } from "./CalendarHeader";
import { MonthGrid } from "./MonthGrid";
import { MonthData, JournalEntry } from "../../types";
import { getCalendarDays } from "../../utils/calendarUtils";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";
import { useJournalStorage } from "../../hooks/useJournalStorage";
import { exportEntries, importEntries } from "../../utils/storageUtils";

const JournalModal = React.lazy(() =>
  import("../Modal/JournalModal").then((module) => ({
    default: module.JournalModal,
  }))
);
const SearchBar = React.lazy(() =>
  import("../Search/SearchBar").then((module) => ({
    default: module.SearchBar,
  }))
);
const JournalEntryForm = React.lazy(() =>
  import("../Forms/JournalEntryForm").then((module) => ({
    default: module.JournalEntryForm,
  }))
);
const DeleteConfirmModal = React.lazy(() =>
  import("../Forms/DeleteConfirmModal").then((module) => ({
    default: module.DeleteConfirmModal,
  }))
);

const MONTH_HEIGHT = 400;
const BUFFER_MONTHS = 12;
const TARGET_MONTH = new Date(2025, 6, 1);

const ComponentLoader: React.FC = React.memo(() => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-pulse h-8 bg-gray-200 rounded w-full max-w-md"></div>
  </div>
));

export const Calendar: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(TARGET_MONTH);
  const [headerAnimating, setHeaderAnimating] = useState(false);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  const {
    entries: journalEntries,
    loading: entriesLoading,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useJournalStorage();

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return journalEntries;
    return journalEntries.filter(
      (entry) =>
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.categories.some((cat) =>
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, journalEntries]);

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
      };
      return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });
  }, [filteredEntries]);

  const months = useMemo(() => {
    const monthsData: MonthData[] = [];

    for (let i = -BUFFER_MONTHS; i <= BUFFER_MONTHS; i++) {
      const monthDate = new Date(2025, 6 + i, 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      monthsData.push({
        year,
        month,
        dates: getCalendarDays(year, month, filteredEntries),
      });
    }

    return monthsData;
  }, [filteredEntries]);

  const { visibleRange, handleScroll, scrollToIndex } = useInfiniteScroll({
    itemHeight: MONTH_HEIGHT,
    initialIndex: BUFFER_MONTHS,
  });

  const navigateToMonth = useCallback(
    (targetDate: Date) => {
      const monthIndex = months.findIndex(
        (m) =>
          m.year === targetDate.getFullYear() &&
          m.month === targetDate.getMonth()
      );

      if (monthIndex !== -1 && scrollContainerRef.current) {
        scrollToIndex(monthIndex, scrollContainerRef.current);
      }
    },
    [months, scrollToIndex]
  );

  const handleArrowUp = useCallback(() => {
    setCurrentDisplayMonth((prevMonth) => {
      const newMonth = subMonths(prevMonth, 1);
      navigateToMonth(newMonth);
      return newMonth;
    });
  }, [navigateToMonth]);

  const handleArrowDown = useCallback(() => {
    setCurrentDisplayMonth((prevMonth) => {
      const newMonth = addMonths(prevMonth, 1);
      navigateToMonth(newMonth);
      return newMonth;
    });
  }, [navigateToMonth]);

  useKeyboardNavigation({
    onArrowUp: handleArrowUp,
    onArrowDown: handleArrowDown,
  });

  const updateCurrentMonth = useCallback(
    (scrollTop: number) => {
      const visibleMonthIndex = Math.round(scrollTop / MONTH_HEIGHT);
      const clampedIndex = Math.max(
        0,
        Math.min(visibleMonthIndex, months.length - 1)
      );

      const visibleMonth = months[clampedIndex];
      if (visibleMonth) {
        const newDate = new Date(visibleMonth.year, visibleMonth.month);

        setCurrentDisplayMonth((prevDate) => {
          if (!isSameMonth(newDate, prevDate)) {
            setHeaderAnimating(true);
            setTimeout(() => setHeaderAnimating(false), 300);
            return newDate;
          }
          return prevDate;
        });
      }
    },
    [months]
  );

  const onScrollHandler = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      handleScroll(event);
      const target = event.target as HTMLDivElement;

      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      startTransition(() => {
        updateCurrentMonth(target.scrollTop);
      });
    },
    [handleScroll, updateCurrentMonth]
  );

  const handleEntryClick = useCallback(
    (clickedEntry: JournalEntry) => {
      if (isScrolling) return;

      const entryIndex = sortedEntries.findIndex(
        (entry) => entry.id === clickedEntry.id
      );
      if (entryIndex !== -1) {
        setSelectedEntryIndex(entryIndex);
        setIsModalOpen(true);
      }
    },
    [sortedEntries, isScrolling]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handlePreviousEntry = useCallback(() => {
    setSelectedEntryIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextEntry = useCallback(() => {
    setSelectedEntryIndex((prev) =>
      prev < sortedEntries.length - 1 ? prev + 1 : prev
    );
  }, [sortedEntries.length]);

  const handleSearch = useCallback((query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  }, []);

  const handleAddEntry = useCallback(
    (date?: Date) => {
      setSelectedDate(date || currentDisplayMonth);
      setEditingEntry(null);
      setIsFormOpen(true);
    },
    [currentDisplayMonth]
  );

  const handleEditEntry = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setSelectedDate(undefined);
    setIsFormOpen(true);
  }, []);

  const handleDeleteEntry = useCallback((entry: JournalEntry) => {
    setEntryToDelete(entry);
    setIsDeleteModalOpen(true);
  }, []);

  const handleSaveEntry = useCallback(
    (entryData: Omit<JournalEntry, "id">) => {
      if (editingEntry) {
        updateEntry(editingEntry.id, entryData);
      } else {
        addEntry(entryData);
      }

      setIsFormOpen(false);
      setEditingEntry(null);
    },
    [editingEntry, updateEntry, addEntry]
  );

  const handleConfirmDelete = useCallback(() => {
    if (entryToDelete) {
      deleteEntry(entryToDelete.id);
      setEntryToDelete(null);
      if (
        isModalOpen &&
        sortedEntries[selectedEntryIndex]?.id === entryToDelete.id
      ) {
        setIsModalOpen(false);
      }
    }
  }, [
    entryToDelete,
    deleteEntry,
    isModalOpen,
    sortedEntries,
    selectedEntryIndex,
  ]);

  const handleExportEntries = useCallback(() => {
    exportEntries(journalEntries);
  }, [journalEntries]);

  const handleImportEntries = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const importedEntries = await importEntries(file);
        importedEntries.forEach((entry) => {
          if (!journalEntries.some((existing) => existing.id === entry.id)) {
            addEntry(entry);
          }
        });

        alert(`Successfully imported ${importedEntries.length} entries!`);
      } catch (error) {
        alert("Failed to import entries. Please check the file format.");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [journalEntries, addEntry]
  );

  useEffect(() => {
    if (scrollContainerRef.current && months.length > 0) {
      const targetScrollPosition = BUFFER_MONTHS * MONTH_HEIGHT;
      scrollContainerRef.current.scrollTop = targetScrollPosition;
    }
  }, [months]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const visibleMonths = useMemo(
    () => months.slice(visibleRange.start, visibleRange.end),
    [months, visibleRange.start, visibleRange.end]
  );

  const startOffset = useMemo(
    () => visibleRange.start * MONTH_HEIGHT,
    [visibleRange.start]
  );

  if (entriesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-600">Loading Calendar...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <CalendarHeader
        currentDate={currentDisplayMonth}
        isAnimating={headerAnimating}
        onAddEntry={() => handleAddEntry()}
        onExportEntries={handleExportEntries}
        onImportEntries={handleImportEntries}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="p-4">
        <React.Suspense fallback={<ComponentLoader />}>
          <SearchBar onSearch={handleSearch} />
        </React.Suspense>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        onScroll={onScrollHandler}
        style={{ scrollBehavior: "auto" }}
      >
        <div
          style={{ height: months.length * MONTH_HEIGHT, position: "relative" }}
        >
          <div style={{ transform: `translateY(${startOffset}px)` }}>
            {visibleMonths.map((monthData, index) => (
              <div
                key={`${monthData.year}-${monthData.month}`}
                className="p-4"
                style={{ height: MONTH_HEIGHT }}
              >
                <MonthGrid
                  monthData={monthData}
                  onEntryClick={handleEntryClick}
                  onAddEntry={handleAddEntry}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && sortedEntries.length > 0 && (
        <React.Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
          }
        >
          <JournalModal
            entries={sortedEntries}
            currentIndex={selectedEntryIndex}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onPrevious={handlePreviousEntry}
            onNext={handleNextEntry}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </React.Suspense>
      )}

      {isFormOpen && (
        <React.Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
          }
        >
          <JournalEntryForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingEntry(null);
            }}
            onSave={handleSaveEntry}
            editingEntry={editingEntry}
            selectedDate={selectedDate}
          />
        </React.Suspense>
      )}

      {isDeleteModalOpen && (
        <React.Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
          }
        >
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setEntryToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            entry={entryToDelete}
          />
        </React.Suspense>
      )}
    </div>
  );
};
