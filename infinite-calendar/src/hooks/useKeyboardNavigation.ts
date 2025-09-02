import { useEffect } from "react";

interface UseKeyboardNavigationOptions {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
}

export const useKeyboardNavigation = (
  options: UseKeyboardNavigationOptions
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          options.onArrowUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          options.onArrowDown?.();
          break;
        case "ArrowLeft":
          event.preventDefault();
          options.onArrowLeft?.();
          break;
        case "ArrowRight":
          event.preventDefault();
          options.onArrowRight?.();
          break;
        case "Escape":
          options.onEscape?.();
          break;
        case "Enter":
          options.onEnter?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [options]);
};
