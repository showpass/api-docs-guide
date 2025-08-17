import { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash-es';

/**
 * Custom hook for tracking the currently active heading while scrolling.
 * Provides smooth, non-flickering scroll spy functionality for table of contents.
 * 
 * @param selectors - CSS selector string for headings to track (e.g., "h2[id], h3[id]")
 * @param offset - Offset from top of viewport in pixels for activation threshold
 * @returns The ID of the currently active heading, or null if none found
 */
export const useScrollSpy = (
  selectors: string,
  offset: number = 100
): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const lastActiveIdRef = useRef<string | null>(null);
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    // Clean up any existing timeouts to prevent memory leaks
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current.clear();

    const updateActiveHeading = throttle(() => {
      const headings = document.querySelectorAll<HTMLElement>(selectors);
      if (headings.length === 0) return;

      const scrollPosition = window.scrollY + offset;
      
      // Map headings to position data and filter out invalid entries
      let headingElements = Array.from(headings).map(heading => ({
        id: heading.id,
        top: heading.offsetTop,
        element: heading
      }));

      // Filter out headings without IDs and sort by position
      headingElements = headingElements
        .filter(heading => heading.id && heading.id.trim())
        .sort((a, b) => a.top - b.top);

      if (headingElements.length === 0) return;

      // Determine active heading based on scroll position
      let currentHeading = headingElements[0];
      
      // Special case: near top of page, always use first heading
      if (window.scrollY <= 50) {
        currentHeading = headingElements[0];
      } else {
        // Find the furthest heading we've scrolled past (with small buffer to prevent flickering)
        for (const heading of headingElements) {
          if (scrollPosition >= heading.top - 10) {
            currentHeading = heading;
          } else {
            break;
          }
        }
      }

      // Update state only when the active heading actually changes
      if (currentHeading && currentHeading.id && currentHeading.id !== lastActiveIdRef.current) {
        lastActiveIdRef.current = currentHeading.id;
        setActiveId(currentHeading.id);
      }
    }, 150);

    // Set up event listeners
    window.addEventListener('scroll', updateActiveHeading, { passive: true });
    
    // Schedule initial calculation to handle page load
    const initialTimeout = setTimeout(updateActiveHeading, 100);
    timeoutRefs.current.add(initialTimeout);
    
    // Handle page visibility changes (e.g., returning from another tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const visibilityTimeout = setTimeout(updateActiveHeading, 50);
        timeoutRefs.current.add(visibilityTimeout);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Run initial calculation immediately
    updateActiveHeading();

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', updateActiveHeading);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current.clear();
    };
  }, [selectors, offset]);

  return activeId;
};
