import { useState, useCallback, useRef, useEffect } from "react";

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export const useSwipeGestures = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeGestureOptions) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; currentX: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(false);
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;

      const currentTouch = e.targetTouches[0].clientX;
      setTouchEnd(currentTouch);

      if (Math.abs(currentTouch - touchStart) > 10) {
        setIsDragging(true);
      }
    },
    [touchStart]
  );

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !isDragging) {
      setIsDragging(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }

    setIsDragging(false);
  }, [touchStart, touchEnd, isDragging, threshold, onSwipeLeft, onSwipeRight]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      currentX: e.clientX,
    };
    setIsDragging(false);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;

    dragRef.current.currentX = e.clientX;
    const distance = Math.abs(e.clientX - dragRef.current.startX);

    if (distance > 10) {
      setIsDragging(true);
    }
  }, []);

  const onMouseUp = useCallback(() => {
    if (!dragRef.current || !isDragging) {
      setIsDragging(false);
      dragRef.current = null;
      return;
    }

    const distance = dragRef.current.startX - dragRef.current.currentX;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }

    setIsDragging(false);
    dragRef.current = null;
  }, [isDragging, threshold, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (dragRef.current) {
        onMouseUp();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;

      dragRef.current.currentX = e.clientX;
      const distance = Math.abs(e.clientX - dragRef.current.startX);

      if (distance > 10) {
        setIsDragging(true);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [onMouseUp]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp: () => {},
  };
};
