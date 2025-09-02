import { useState, useEffect, useCallback } from "react";

interface UseInfiniteScrollOptions {
  itemHeight: number;
  initialIndex?: number;
  totalItems?: number;
}

export const useInfiniteScroll = ({
  itemHeight,
  initialIndex = 0,
}: UseInfiniteScrollOptions) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      const scrollTop = target.scrollTop;
      setScrollTop(scrollTop);

      const containerHeight = target.clientHeight;
      const startIndex = Math.floor(scrollTop / itemHeight) - 2;
      const endIndex =
        Math.ceil((scrollTop + containerHeight) / itemHeight) + 2;

      setVisibleRange({
        start: Math.max(0, startIndex),
        end: Math.max(endIndex, 10),
      });
    },
    [itemHeight]
  );

  const scrollToIndex = useCallback(
    (index: number, element: HTMLElement) => {
      const targetScrollTop = index * itemHeight;
      element.scrollTo({ top: targetScrollTop, behavior: "smooth" });
    },
    [itemHeight]
  );

  return {
    visibleRange,
    scrollTop,
    handleScroll,
    scrollToIndex,
  };
};
