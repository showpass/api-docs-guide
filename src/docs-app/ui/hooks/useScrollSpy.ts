
import { useState, useEffect } from 'react';
import { throttle } from 'lodash-es';

export const useScrollSpy = (
  selectors: string,
  offset: number = 0
): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selectors);
    if (elements.length === 0) return;

    const handleScroll = throttle(() => {
      // Get all headings and their positions
      const headingElements = Array.from(elements);
      
      // Find the heading that is currently at the top of the viewport (plus offset)
      const headingPositions = headingElements.map((element) => {
        return {
          id: element.id,
          position: element.getBoundingClientRect().top - offset
        };
      });
      
      // Find the first heading that is at or below the threshold
      const activeHeading = headingPositions.find(
        (heading) => heading.position >= 0
      );
      
      // If we found an active heading and it's different from the current active heading
      if (activeHeading) {
        setActiveId(activeHeading.id);
      } else if (headingPositions.length > 0) {
        // If all headings are above the viewport, use the last one
        setActiveId(headingPositions[headingPositions.length - 1].id);
      }
    }, 100); // Throttle to improve performance

    // Attach event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once to initialize
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectors, offset]);

  return activeId;
};
