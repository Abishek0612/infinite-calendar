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
import { journalEntries } from "../../data/journalData";

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

const MONTH_HEIGHT = 400;
const BUFFER_MONTHS = 12;

const ComponentLoader: React.FC = React.memo(() => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-pulse h-8 bg-gray-200 rounded w-full max-w-md"></div>
  </div>
));

export const Calendar: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(new Date());
  const [headerAnimating, setHeaderAnimating] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<JournalEntry[]>([]);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return journalEntries;

    return journalEntries.filter(
      (entry) =>
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.categories.some((cat) =>
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery]);

  const months = useMemo(() => {
    const monthsData: MonthData[] = [];

    for (let i = -BUFFER_MONTHS; i <= BUFFER_MONTHS; i++) {
      const date = addMonths(new Date(), i);
      const year = date.getFullYear();
      const month = date.getMonth();

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

      startTransition(() => {
        updateCurrentMonth(target.scrollTop);
      });
    },
    [handleScroll, updateCurrentMonth]
  );

  const handleEntryClick = useCallback(
    (entryIndex: number, monthData: MonthData) => {
      const allEntriesInMonth = monthData.dates
        .flatMap((date) => date.journalEntries)
        .filter((entry) => entry !== undefined);

      setSelectedEntries(allEntriesInMonth);
      setSelectedEntryIndex(entryIndex);
      setIsModalOpen(true);
    },
    []
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handlePreviousEntry = useCallback(() => {
    setSelectedEntryIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextEntry = useCallback(() => {
    setSelectedEntryIndex((prev) => {
      setSelectedEntries((entries) => {
        return prev < entries.length - 1 ? entries : entries;
      });
      return prev < selectedEntries.length - 1 ? prev + 1 : prev;
    });
  }, [selectedEntries.length]);

  const handleSearch = useCallback((query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = BUFFER_MONTHS * MONTH_HEIGHT;
    }
  }, []);

  const visibleMonths = useMemo(
    () => months.slice(visibleRange.start, visibleRange.end),
    [months, visibleRange.start, visibleRange.end]
  );

  const startOffset = useMemo(
    () => visibleRange.start * MONTH_HEIGHT,
    [visibleRange.start]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <CalendarHeader
        currentDate={currentDisplayMonth}
        isAnimating={headerAnimating}
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <React.Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>
          }
        >
          <JournalModal
            entries={selectedEntries}
            currentIndex={selectedEntryIndex}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onPrevious={handlePreviousEntry}
            onNext={handleNextEntry}
          />
        </React.Suspense>
      )}
    </div>
  );
};
