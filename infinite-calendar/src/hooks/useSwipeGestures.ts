import { useCallback, useRef } from "react";

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
  const dragInfo = useRef<{
    startX: number;
    isDragging: boolean;
  } | null>(null);

  // --- Touch Handlers ---
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const startX = e.targetTouches[0].clientX;
    dragInfo.current = { startX, isDragging: false };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragInfo.current) return;

    const currentX = e.targetTouches[0].clientX;
    const distance = Math.abs(currentX - dragInfo.current.startX);

    if (!dragInfo.current.isDragging && distance > 10) {
      dragInfo.current.isDragging = true;
    }
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!dragInfo.current?.isDragging) {
        dragInfo.current = null;
        return;
      }

      const endX = e.changedTouches[0].clientX;
      const distance = dragInfo.current.startX - endX;

      const isLeftSwipe = distance > threshold;
      const isRightSwipe = distance < -threshold;

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }

      dragInfo.current = null;
    },
    [threshold, onSwipeLeft, onSwipeRight]
  );

  // --- Mouse Handlers ---
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragInfo.current = { startX: e.clientX, isDragging: false };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragInfo.current) return;

        const distance = Math.abs(moveEvent.clientX - dragInfo.current.startX);
        if (!dragInfo.current.isDragging && distance > 10) {
          dragInfo.current.isDragging = true;
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (dragInfo.current?.isDragging) {
          const distance = dragInfo.current.startX - upEvent.clientX;
          const isLeftSwipe = distance > threshold;
          const isRightSwipe = distance < -threshold;

          if (isLeftSwipe && onSwipeLeft) {
            onSwipeLeft();
          } else if (isRightSwipe && onSwipeRight) {
            onSwipeRight();
          }
        }
        dragInfo.current = null;
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [threshold, onSwipeLeft, onSwipeRight]
  );

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
  };
};
