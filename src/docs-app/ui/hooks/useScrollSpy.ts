
import { useState, useEffect } from "react";

/**
 * Hook that tracks the active section based on scroll position
 * 
 * @param selectors - CSS selectors for sections to track
 * @param offset - Offset from the top to consider a section "active"
 * @returns The active section ID with '#' prefix for anchor links
 */
export function useScrollSpy(selectors: string, offset: number = 100): string {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(selectors);
      
      // Early return if no sections found
      if (sections.length === 0) return;

      // Start from the end and go up - sections lower in the page should take precedence
      // when they reach the threshold
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i] as HTMLElement;
        const rect = section.getBoundingClientRect();
        
        if (rect.top <= offset) {
          const newActiveSection = `#${section.id}`;
          if (activeSection !== newActiveSection) {
            setActiveSection(newActiveSection);
          }
          break;
        }
      }

      // Edge case: If scrolled all the way up, use the first section
      if (window.scrollY < 10 && sections.length > 0) {
        const firstSection = sections[0] as HTMLElement;
        setActiveSection(`#${firstSection.id}`);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initialize active section on load
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectors, offset]);

  return activeSection;
}
