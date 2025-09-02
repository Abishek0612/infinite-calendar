import React, { useState, useRef, useEffect } from "react";
import { JournalEntry } from "../../types";

interface JournalEntryCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement | null>,
  options: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

export const JournalEntryCard: React.FC<JournalEntryCardProps> = React.memo(
  ({ entry, onClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const isVisible = useIntersectionObserver(cardRef, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    const renderStars = React.useMemo(
      () => (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`text-xs ${
              index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ));
      },
      []
    );

    const handleImageLoad = React.useCallback(() => {
      requestAnimationFrame(() => {
        setImageLoaded(true);
        setImageError(false);
      });
    }, []);

    const handleImageError = React.useCallback(() => {
      requestAnimationFrame(() => {
        setImageError(true);
        setImageLoaded(false);
      });
    }, []);

    useEffect(() => {
      setImageLoaded(false);
      setImageError(false);
    }, [entry.imgUrl]);

    return (
      <div
        ref={cardRef}
        onClick={onClick}
        className="relative w-12 h-12 cursor-pointer group transform transition-transform hover:scale-105"
      >
        {isVisible ? (
          <>
            {!imageError ? (
              <>
                {!imageLoaded && (
                  <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse" />
                )}
                <img
                  src={entry.imgUrl}
                  alt="Journal entry"
                  className={`w-full h-full object-cover rounded-lg shadow-sm transition-opacity duration-200 ${
                    imageLoaded ? "opacity-100" : "opacity-0 absolute"
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium">
                📷
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-lg" />
        )}

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200" />
        <div className="absolute -top-1 -right-1 bg-white rounded-full px-1 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex">{renderStars(entry.rating)}</div>
        </div>
      </div>
    );
  }
);

JournalEntryCard.displayName = "JournalEntryCard";
