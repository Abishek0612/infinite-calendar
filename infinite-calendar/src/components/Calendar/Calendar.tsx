import React, { useState, useRef, useEffect, useMemo } from "react";
import { addMonths, subMonths, isSameMonth } from "date-fns";
import { CalendarHeader } from "./CalendarHeader";
import { MonthGrid } from "./MonthGrid";
import { JournalModal } from "../Modal/JournalModal";
import { SearchBar } from "../Search/SearchBar";
import { MonthData, JournalEntry } from "../../types";
import { getCalendarDays } from "../../utils/calendarUtils";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";
import { journalEntries } from "../../data/journalData";

const MONTH_HEIGHT = 400;
const BUFFER_MONTHS = 12;

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
    const startDate = subMonths(new Date(), BUFFER_MONTHS);

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

  useKeyboardNavigation({
    onArrowUp: () => {
      const newMonth = subMonths(currentDisplayMonth, 1);
      setCurrentDisplayMonth(newMonth);
      navigateToMonth(newMonth);
    },
    onArrowDown: () => {
      const newMonth = addMonths(currentDisplayMonth, 1);
      setCurrentDisplayMonth(newMonth);
      navigateToMonth(newMonth);
    },
  });

  const navigateToMonth = (targetDate: Date) => {
    const monthIndex = months.findIndex(
      (m) =>
        m.year === targetDate.getFullYear() && m.month === targetDate.getMonth()
    );

    if (monthIndex !== -1 && scrollContainerRef.current) {
      scrollToIndex(monthIndex, scrollContainerRef.current);
    }
  };

  const updateCurrentMonth = (scrollTop: number) => {
    const visibleMonthIndex = Math.round(scrollTop / MONTH_HEIGHT);
    const clampedIndex = Math.max(
      0,
      Math.min(visibleMonthIndex, months.length - 1)
    );

    const visibleMonth = months[clampedIndex];
    if (visibleMonth) {
      const newDate = new Date(visibleMonth.year, visibleMonth.month);

      if (!isSameMonth(newDate, currentDisplayMonth)) {
        setHeaderAnimating(true);
        setCurrentDisplayMonth(newDate);

        setTimeout(() => setHeaderAnimating(false), 300);
      }
    }
  };

  const onScrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
    handleScroll(event);
    const target = event.target as HTMLDivElement;
    updateCurrentMonth(target.scrollTop);
  };

  const handleEntryClick = (entryIndex: number, monthData: MonthData) => {
    const allEntriesInMonth = monthData.dates
      .flatMap((date) => date.journalEntries)
      .filter((entry) => entry !== undefined);

    setSelectedEntries(allEntriesInMonth);
    setSelectedEntryIndex(entryIndex);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePreviousEntry = () => {
    if (selectedEntryIndex > 0) {
      setSelectedEntryIndex(selectedEntryIndex - 1);
    }
  };

  const handleNextEntry = () => {
    if (selectedEntryIndex < selectedEntries.length - 1) {
      setSelectedEntryIndex(selectedEntryIndex + 1);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = BUFFER_MONTHS * MONTH_HEIGHT;
    }
  }, []);

  const visibleMonths = months.slice(visibleRange.start, visibleRange.end);
  const startOffset = visibleRange.start * MONTH_HEIGHT;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <CalendarHeader
        currentDate={currentDisplayMonth}
        isAnimating={headerAnimating}
      />

      <div className="p-4">
        <SearchBar onSearch={setSearchQuery} />
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
                  onEntryClick={(entryIndex) =>
                    handleEntryClick(entryIndex, monthData)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <JournalModal
        entries={selectedEntries}
        currentIndex={selectedEntryIndex}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onPrevious={handlePreviousEntry}
        onNext={handleNextEntry}
      />
    </div>
  );
};
