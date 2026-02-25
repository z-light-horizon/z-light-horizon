import { useState, useEffect, useRef, useMemo } from "react";

function InfiniteCarousel({
  items = [],
  itemWidth = 320,
  gap = "40px",
  bgColour = "",
}) {
  const totalItems = items.length;
  const containerRef = useRef(null);
  const [responsiveWidth, setResponsiveWidth] = useState(itemWidth);
  const [responsiveHeight, setResponsiveHeight] = useState(400);
  const [currentIndex, setCurrentIndex] = useState(totalItems * 2);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const transitionTimeoutRef = useRef(null);
  const isJumpingRef = useRef(false);

  const gapValue = parseInt(gap);

  // Memoize extended items so they don't recreate every render
  const extendedItems = useMemo(
    () => [...items, ...items, ...items, ...items, ...items],
    [items]
  );

  useEffect(() => {
    if (totalItems === 0) return;

    const calculateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const arrowSpace = 160;
        const availableWidth = containerWidth - arrowSpace - gapValue * 2;
        const calculatedWidth = Math.floor(availableWidth / 3);
        const calculatedHeight = Math.floor(calculatedWidth * 0.75);
        setResponsiveWidth(calculatedWidth);
        setResponsiveHeight(calculatedHeight);
      }
    };

    calculateWidth();

    const resizeObserver = new ResizeObserver(calculateWidth);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [gapValue, totalItems]);

  useEffect(() => {
    if (totalItems === 0 || isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }

    const minSafeIndex = totalItems;
    const maxSafeIndex = totalItems * 4 - 1;

    if (currentIndex < minSafeIndex || currentIndex > maxSafeIndex) {
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        isJumpingRef.current = true;
        setCurrentIndex((prev) =>
          prev < minSafeIndex ? prev + totalItems : prev - totalItems
        );
        setTimeout(() => setIsTransitioning(true), 50);
      }, 1000);
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentIndex, totalItems]);

  if (totalItems === 0) return null;

  function handleLeftClick() {
    if (transitionTimeoutRef.current)
      clearTimeout(transitionTimeoutRef.current);
    setIsTransitioning(true);
    isJumpingRef.current = false;
    setCurrentIndex((prev) => prev - 1);
  }

  function handleRightClick() {
    if (transitionTimeoutRef.current)
      clearTimeout(transitionTimeoutRef.current);
    setIsTransitioning(true);
    isJumpingRef.current = false;
    setCurrentIndex((prev) => prev + 1);
  }

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-between items-center ${bgColour}`}
      style={{ height: `${responsiveHeight}px` }}
    >
      {/* Left Arrow Button */}
      <button
        className="h-20 w-20 cursor-pointer flex justify-center items-center hover:bg-amber-300 rounded-full transition-colors z-10 flex-shrink-0"
        onClick={handleLeftClick}
        aria-label="Previous"
      >
        <svg
          className="w-10 h-10 -scale-x-100 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Carousel Container */}
      <div className="h-full w-full overflow-hidden flex justify-center items-center">
        <div
          className={`flex h-full ${
            isTransitioning
              ? "transition-transform duration-1000 ease-in-out"
              : ""
          }`}
          style={{
            transform: `translate3d(calc(50% - ${
              responsiveWidth / 2
            }px - ${currentIndex} * (${responsiveWidth}px + ${gap})), 0, 0)`,
            backfaceVisibility: "hidden",
            perspective: "1000px",
            willChange: "transform",
          }}
        >
          {extendedItems.map((item, index) => (
            <div
              key={index}
              className="h-full shrink-0"
              style={{
                width: `${responsiveWidth}px`,
                marginLeft: index === 0 ? "0" : gap,
                backfaceVisibility: "hidden",
                transform: "translateZ(0)",
                containIntrinsicSize: "auto",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow Button */}
      <button
        className="h-20 w-20 cursor-pointer flex justify-center items-center hover:bg-amber-300 rounded-full transition-colors z-10 flex-shrink-0"
        onClick={handleRightClick}
        aria-label="Next"
      >
        <svg
          className="w-10 h-10 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

export default InfiniteCarousel;
